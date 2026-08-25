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

// ---- voz neuronal (edge-tts) ----------------------------------------------
// El mismo servicio con el que se pregrabaron los clips del curso, para que el
// texto dinamico (chat, ensayos) suene con LA MISMA voz (Aria). Es el servicio
// de "leer en voz alta" de Edge: websocket + un token derivado de la hora.
// Si Microsoft cambia el protocolo, el fallback es la TTS de Groq (orpheus).

const EDGE_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';

async function edgeGEC() {
  // SHA-256 de (ticks de Windows redondeados a 5 min + token), en hex mayusculas.
  const seg = Math.floor(Date.now() / 1000) + 11644473600;
  const ticks = (seg - (seg % 300)) * 10000000;
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(ticks) + EDGE_TOKEN));
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function escapaXML(t) {
  return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function edgeTTS(texto, voz) {
  const gec = await edgeGEC();
  const id = crypto.randomUUID().replace(/-/g, '');
  const url = 'https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1' +
    '?TrustedClientToken=' + EDGE_TOKEN + '&Sec-MS-GEC=' + gec +
    '&Sec-MS-GEC-Version=1-143.0.3650.75&ConnectionId=' + id;
  const r = await fetch(url, {
    headers: {
      Upgrade: 'websocket',
      Origin: 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',
      'Accept-Language': 'en-US'
    }
  });
  const ws = r.webSocket;
  if (!ws) throw new Error('edge-tts: sin websocket (' + r.status + ')');
  ws.accept();

  // Formato de fecha estilo JS (Date.toString), que es lo que espera el servicio.
  const marcaTiempo = new Date().toString();
  const ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>" +
    "<voice name='" + voz + "'><prosody pitch='+0Hz' rate='-10%' volume='+0%'>" +
    escapaXML(texto) + '</prosody></voice></speak>';

  const trozos = [];
  const traza = [];
  const listo = new Promise((res, rej) => {
    ws.addEventListener('message', (ev) => {
      if (typeof ev.data === 'string') {
        traza.push('txt:' + ev.data.slice(0, 60).replace(/[\r\n]+/g, ' '));
        if (ev.data.includes('Path:turn.end')) { try { ws.close(); } catch (e) {} res(); }
        return;
      }
      // Frame binario: 2 bytes de largo de cabecera + cabecera + audio.
      const b = new Uint8Array(ev.data);
      const largo = (b[0] << 8) | b[1];
      const cabecera = new TextDecoder().decode(b.slice(2, 2 + largo));
      if (cabecera.includes('Path:audio')) trozos.push(b.slice(2 + largo));
    });
    ws.addEventListener('error', (e) => rej(new Error('edge-tts: fallo del socket ' + ((e && e.message) || ''))));
    ws.addEventListener('close', (e) => { traza.push('close:' + e.code + ':' + (e.reason || '')); res(); });
    setTimeout(() => rej(new Error('edge-tts: no respondio a tiempo')), 15000);
  });

  ws.send('X-Timestamp:' + marcaTiempo + '\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n' +
    '{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"true","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n');
  // La Z extra tras el timestamp del ssml no es un error: el servicio la espera
  // asi (bug historico de Edge que toda implementacion imita).
  ws.send('X-RequestId:' + id + '\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:' + marcaTiempo + 'Z\r\nPath:ssml\r\n\r\n' + ssml);

  await listo;
  if (!trozos.length) throw new Error('edge-tts: sin audio [' + traza.join(' | ').slice(0, 300) + ']');
  const total = trozos.reduce((n, t) => n + t.length, 0);
  const salida = new Uint8Array(total);
  let pos = 0;
  for (const t of trozos) { salida.set(t, pos); pos += t.length; }
  return salida;
}

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

      // Texto dinámico (chat, ensayos) dicho con voz neuronal de Groq: el
      // contenido fijo del curso ya va pregrabado, esto cubre lo que no se
      // puede pregrabar. Sin clave responde 503 y la página usa el sintetizador.
      if (url.pathname === '/ia/voz' && req.method === 'POST') {
        const { texto } = await req.json().catch(() => ({}));
        if (!texto || String(texto).trim().length < 1) return json({ error: 'sin texto' }, 400);
        const recorte = String(texto).slice(0, 800);
        // Groq (orpheus) es el titular; pide aceptar sus terminos UNA vez en la
        // consola de Groq. edge-tts queda de reserva por si falla o se agota:
        // desde el worker Microsoft completa el handshake pero no sirve audio a
        // IPs de datacenter (comprobado 2026-08-25), asi que casi nunca salvara,
        // pero es gratis intentarlo.
        let detalle = '';
        if (env.GROQ_API_KEY) {
          const r = await fetch('https://api.groq.com/openai/v1/audio/speech', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + env.GROQ_API_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'canopylabs/orpheus-v1-english', voice: 'tara',
              input: recorte, response_format: 'wav'
            })
          });
          if (r.ok) return new Response(r.body, { headers: { 'Content-Type': 'audio/wav', ...cors } });
          detalle = '[groq] tts ' + r.status + ': ' + (await r.text()).slice(0, 160);
        }
        try {
          const mp3 = await edgeTTS(recorte, 'en-US-AriaNeural');
          return new Response(mp3, { headers: { 'Content-Type': 'audio/mpeg', ...cors } });
        } catch (e) {
          return json({ error: (detalle || 'sin clave de IA') + ' | [edge] ' + String((e && e.message) || e).slice(0, 120) }, 502);
        }
      }

      return json({ error: 'no existe' }, 404);
    } catch (e) {
      return json({ error: String(e.message || e).slice(0, 300) }, 500);
    }
  }
};
