/* INGLES — worker del curso de inglés de Dosa.
   ---------------------------------------------------------------------------
   Hace dos cosas:
   1. Guarda el progreso (XP, racha, repaso espaciado) en KV, para que el
      curso siga igual en el PC y en el celular.
   2. Hace de proxy de Groq para la corrección de ensayos y el modo de
      conversación, para no exponer la clave en la página (que es pública).

   Público:
     GET  /health                    -> ok
     POST /entrar {pase}             -> {token, exp}; el pase es el secret INGLES_PASE
   Con pase (Authorization: Bearer <token>):
     GET  /progreso                  -> el JSON guardado (o null)
     PUT  /progreso                  -> lo reemplaza (valida JSON, máx. 256 KB)
     POST /ia/ensayo {consigna, texto, nivel}    -> corrección estructurada
     POST /ia/chat   {mensajes, nivel}           -> respuesta del tutor

   El token va firmado (HMAC-SHA256 con el propio pase de clave) y lleva su
   caducidad dentro, igual que el de MOOVIN: no hay nada que guardar y un
   token que se escape muere solo. Dura 30 días: es una herramienta personal,
   no una biblioteca compartida.

   Desplegar:  npx wrangler deploy              (desde worker/)
   Secretos:   npx wrangler secret put INGLES_PASE
               npx wrangler secret put GROQ_API_KEY   (sin ella, /ia/* responde
               503 y la página lo explica; el resto del curso sigue igual)
*/

const TTL = 30 * 24 * 3600;

// Groq retiró llama-3.3-70b-versatile (ver iris-bot): gpt-oss-120b es el que queda.
const MODELO = 'openai/gpt-oss-120b';
const GROQ = 'https://api.groq.com/openai/v1/chat/completions';

const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)))
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

// Comparación en tiempo constante: comparar con === filtra el secreto letra a letra.
function igual(a, b) {
  a = String(a); b = String(b);
  if (a.length !== b.length || !a.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

async function firma(env, texto) {
  const clave = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode((env.INGLES_PASE || '').trim()),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  return b64url(await crypto.subtle.sign('HMAC', clave, new TextEncoder().encode(texto)));
}

async function nuevoToken(env) {
  const exp = Math.floor(Date.now() / 1000) + TTL;
  return { token: exp + '.' + await firma(env, String(exp)), exp };
}

async function tokenOk(env, t) {
  const i = String(t || '').indexOf('.');
  if (i < 1) return false;
  const exp = parseInt(t.slice(0, i), 10);
  if (!(exp > Math.floor(Date.now() / 1000))) return false;
  return igual(t.slice(i + 1), await firma(env, String(exp)));
}

// ---- IA -------------------------------------------------------------------

// El modelo razona: hay que darle sitio para pensar y luego quitarle el
// razonamiento si lo mete en el propio mensaje (mismas mañas que en iris-bot).
function limpiaRazonamiento(texto) {
  return String(texto || '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/^[\s\S]*?<\/think>/i, '')
    .trim();
}

async function llamaGroq(env, mensajes, maxTokens) {
  const r = await fetch(GROQ, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + env.GROQ_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODELO,
      messages: mensajes,
      max_completion_tokens: maxTokens,
      temperature: 0.6
    })
  });
  if (!r.ok) {
    const detalle = await r.text().catch(() => '');
    throw new Error('Groq ' + r.status + ': ' + detalle.slice(0, 300));
  }
  const data = await r.json();
  const m = data.choices?.[0]?.message || {};
  // Con gpt-oss el razonamiento llega en `reasoning` y el mensaje limpio en
  // `content`; si `content` viene vacío, no hay respuesta que dar.
  return limpiaRazonamiento(m.content);
}

// Saca el primer bloque JSON de una respuesta que puede venir con texto alrededor.
function primerJSON(texto) {
  const i = texto.indexOf('{');
  if (i < 0) return null;
  for (let f = texto.length; f > i; f--) {
    try { return JSON.parse(texto.slice(i, f)); } catch (e) { /* sigue */ }
  }
  return null;
}

const PROMPT_ENSAYO = `Eres el corrector de un curso de inglés para UN estudiante hispanohablante principiante (nivel {NIVEL}). Te llega un texto corto escrito en inglés como tarea.

Respondes SOLO un objeto JSON, sin nada alrededor, con esta forma exacta:
{
 "puntaje": <0-100, entero>,
 "resumen": "<una o dos frases en español sobre cómo le fue>",
 "correcciones": [
   {"original": "<fragmento con error>", "corregido": "<fragmento arreglado>", "explicacion": "<por qué, en español simple>"}
 ],
 "version_mejorada": "<el texto completo, corregido, en inglés>",
 "consejo": "<un consejo concreto en español para el próximo ensayo>"
}

Reglas:
- Todo el español en neutro latino (ustedes, acá no; jamás vosotros/os/vale).
- Máximo 6 correcciones: las más importantes primero. Si repite el mismo error, corrígelo una vez y dilo en la explicación.
- El puntaje mide si se entiende y si usa lo esperable del nivel; no castigues vocabulario que aún no vio.
- Si el texto no está en inglés o está vacío, puntaje 0 y explícalo en "resumen".
- Sin emojis.`;

const PROMPT_CHAT = `Eres un tutor de conversación de un curso de inglés para UN estudiante hispanohablante de nivel {NIVEL} (principiante). Conversan por chat.

Reglas:
- Responde en inglés MUY simple del nivel {NIVEL}: frases cortas, vocabulario básico, presente simple. Una o dos frases, y termina casi siempre con una pregunta sencilla para que el estudiante siga hablando.
- Si el estudiante comete un error importante, corrígelo en UNA línea aparte al final con el formato: [Mejor: "<frase corregida>"] — solo una por turno, la más importante.
- Si el estudiante escribe en español o pide ayuda, explica en español neutro latino (nunca vosotros/vale) en una línea y retoma en inglés.
- Nada de listas, nada de emojis, nada de teatro. Eres amable y directo.`;

// ---- principal ------------------------------------------------------------

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization,Content-Type',
      'Access-Control-Max-Age': '86400'
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

    const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
      status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors }
    });

    try {
      if (url.pathname === '/health') return json({ ok: true });

      if (url.pathname === '/entrar' && req.method === 'POST') {
        const { pase } = await req.json().catch(() => ({}));
        if (!igual(pase, (env.INGLES_PASE || '').trim())) {
          return json({ error: 'pase incorrecto' }, 401);
        }
        return json(await nuevoToken(env));
      }

      // Todo lo demás pide el token.
      const auth = req.headers.get('Authorization') || '';
      const t = auth.startsWith('Bearer ') ? auth.slice(7) : '';
      if (!(await tokenOk(env, t))) return json({ error: 'hace falta el pase' }, 401);

      if (url.pathname === '/progreso' && req.method === 'GET') {
        const guardado = await env.INGLES_KV.get('progreso');
        return new Response(guardado || 'null', {
          headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors }
        });
      }

      if (url.pathname === '/progreso' && req.method === 'PUT') {
        const cuerpo = await req.text();
        if (cuerpo.length > 256 * 1024) return json({ error: 'demasiado grande' }, 413);
        JSON.parse(cuerpo); // valida; si no es JSON, revienta al catch
        await env.INGLES_KV.put('progreso', cuerpo);
        return json({ ok: true });
      }

      if (url.pathname === '/ia/ensayo' && req.method === 'POST') {
        if (!env.GROQ_API_KEY) return json({ error: 'sin clave de IA' }, 503);
        const { consigna, texto, nivel } = await req.json().catch(() => ({}));
        if (!texto || String(texto).trim().length < 5) return json({ error: 'ensayo vacío' }, 400);
        const sistema = PROMPT_ENSAYO.replace(/\{NIVEL\}/g, nivel || 'A1');
        const usuario = 'Consigna de la tarea: ' + (consigna || '(libre)') +
          '\n\nTexto del estudiante:\n' + String(texto).slice(0, 4000);
        const crudo = await llamaGroq(env, [
          { role: 'system', content: sistema },
          { role: 'user', content: usuario }
        ], 2000);
        const obj = primerJSON(crudo);
        if (!obj || typeof obj.puntaje !== 'number') {
          return json({ error: 'la IA no devolvió una corrección válida' }, 502);
        }
        return json(obj);
      }

      if (url.pathname === '/ia/chat' && req.method === 'POST') {
        if (!env.GROQ_API_KEY) return json({ error: 'sin clave de IA' }, 503);
        const { mensajes, nivel } = await req.json().catch(() => ({}));
        if (!Array.isArray(mensajes) || !mensajes.length) return json({ error: 'sin mensajes' }, 400);
        const sistema = PROMPT_CHAT.replace(/\{NIVEL\}/g, nivel || 'A1');
        // Solo los últimos 16 turnos y solo texto: el historial lo manda la página.
        const recorte = mensajes.slice(-16).map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: String(m.content || '').slice(0, 1000)
        }));
        const texto = await llamaGroq(env, [{ role: 'system', content: sistema }, ...recorte], 1200);
        if (!texto) return json({ error: 'respuesta vacía de la IA' }, 502);
        return json({ texto });
      }

      return json({ error: 'no existe' }, 404);
    } catch (e) {
      return json({ error: String(e.message || e).slice(0, 300) }, 500);
    }
  }
};
