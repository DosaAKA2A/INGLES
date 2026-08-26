/* INGLES — todo lo que cuesta dinero: Groq (ensayos, tutor, oido) y las
   voces neuronales. Es la parte de PAGO del curso: pide licencia premium
   activa y lleva cuota diaria por cuenta, porque una sesion abierta puede
   quemar la cuota de Groq entera sin mala intencion.
*/

import { ahora, hoy } from './util.js';

// Groq retiró llama-3.3-70b-versatile (ver iris-bot): gpt-oss-120b es el que queda.
const MODELO = 'openai/gpt-oss-120b';
const GROQ = 'https://api.groq.com/openai/v1/chat/completions';

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
      // Sin esto el modelo gasta dos tercios de la salida razonando un saludo
      // (medido: 401 tokens por turno contra 266 con low, misma respuesta).
      reasoning_effort: 'low',
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

// ---- cuota ----------------------------------------------------------------
// Los topes son por cuenta y por dia natural (UTC). No estan para exprimir al
// estudiante: estan para que una cuenta robada, o un bucle en la pagina, no se
// lleven por delante la cuota mensual de Groq.

export const TOPES = { chat: 80, ensayo: 12, voz: 300, oido: 300 };

async function gastaCuota(env, usuarioId, tipo) {
  const dia = hoy();
  const fila = await env.DB.prepare(
    `INSERT INTO uso_ia (usuario_id, dia, llamadas, tokens) VALUES (?1, ?2, 1, 0)
     ON CONFLICT(usuario_id, dia) DO UPDATE SET llamadas = llamadas + 1
     RETURNING llamadas`
  ).bind(usuarioId, dia).first();

  const suyas = await env.DB.prepare(
    `INSERT INTO limites (clave, cuenta, ventana) VALUES (?1, 1, ?2)
     ON CONFLICT(clave) DO UPDATE SET cuenta = cuenta + 1 RETURNING cuenta`
  ).bind('ia:' + tipo + ':' + usuarioId + ':' + dia, ahora() + 2 * 86400).first();

  return { ok: (suyas?.cuenta ?? 1) <= (TOPES[tipo] || 50), total: fila?.llamadas ?? 1 };
}

// ---- rutas ----------------------------------------------------------------
// `usuario` ya viene autenticado y con licencia premium comprobada por el
// router: aca no se vuelve a mirar, pero tampoco se llama a nadie sin eso.

export async function ruta(env, req, url, usuario, cors) {
  const json = (obj, estado = 200) => new Response(JSON.stringify(obj), {
    status: estado, headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors }
  });
  const p = url.pathname;

  const tipo = p === '/ia/ensayo' ? 'ensayo' : p === '/ia/chat' ? 'chat'
    : p === '/ia/voz' ? 'voz' : p === '/ia/oido' ? 'oido' : null;
  if (!tipo) return json({ error: 'no existe' }, 404);

  const cuota = await gastaCuota(env, usuario.id, tipo);
  if (!cuota.ok) {
    return json({ error: 'llegaste al tope de hoy (' + TOPES[tipo] + '). Vuelve mañana.' }, 429);
  }

  if (p === '/ia/ensayo') {
    if (!env.GROQ_API_KEY) return json({ error: 'sin clave de IA' }, 503);
    const { consigna, texto, nivel, nombre, motivo } = await req.json().catch(() => ({}));
    if (!texto || String(texto).trim().length < 5) return json({ error: 'ensayo vacío' }, 400);
    let sistema = PROMPT_ENSAYO.replace(/\{NIVEL\}/g, nivel || 'A1');
    if (nombre || motivo) sistema += '\nContexto: el estudiante' + (nombre ? ' se llama ' + String(nombre).slice(0, 40) : '') + (motivo ? ' y aprende ingles por: ' + String(motivo).slice(0, 60) + ' (el consejo puede orientarse a eso)' : '') + '.';
    const usuarioMsg = 'Consigna de la tarea: ' + (consigna || '(libre)') +
      '\n\nTexto del estudiante:\n' + String(texto).slice(0, 4000);
    const crudo = await llamaGroq(env, [
      { role: 'system', content: sistema },
      { role: 'user', content: usuarioMsg }
    ], 2000);
    const obj = primerJSON(crudo);
    if (!obj || typeof obj.puntaje !== 'number') {
      return json({ error: 'la IA no devolvió una corrección válida' }, 502);
    }
    return json(obj);
  }

  if (p === '/ia/chat') {
    if (!env.GROQ_API_KEY) return json({ error: 'sin clave de IA' }, 503);
    const { mensajes, nivel, nombre, motivo } = await req.json().catch(() => ({}));
    if (!Array.isArray(mensajes) || !mensajes.length) return json({ error: 'sin mensajes' }, 400);
    let sistema = PROMPT_CHAT.replace(/\{NIVEL\}/g, nivel || 'A1');
    if (nombre) sistema += '\n- El estudiante se llama ' + String(nombre).slice(0, 40) + '.';
    if (motivo) sistema += '\n- Aprende ingles sobre todo por: ' + String(motivo).slice(0, 60) + '. Cuando salga natural, orienta ejemplos y preguntas hacia ese interes (sin forzarlo en cada turno).';
    const recorte = mensajes.slice(-10).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 1000)
    }));
    const texto = await llamaGroq(env, [{ role: 'system', content: sistema }, ...recorte], 1200);
    if (!texto) return json({ error: 'respuesta vacía de la IA' }, 502);
    return json({ texto });
  }

  if (p === '/ia/voz') {
    const { texto } = await req.json().catch(() => ({}));
    if (!texto || String(texto).trim().length < 1) return json({ error: 'sin texto' }, 400);
    const recorte = String(texto).slice(0, 800);
    const motor = url.searchParams.get('motor') || '';
    const fallos = [];

    if (!motor || motor === 'aria') {
      if (!env.VOZ_CLAVE) {
        fallos.push('[aria] sin VOZ_CLAVE');
      } else {
        try {
          const r = await fetch('https://voz.iris.it.com/voz', {
            method: 'POST',
            headers: { 'X-Clave': env.VOZ_CLAVE, 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: recorte })
          });
          if (r.ok) return new Response(r.body, { headers: { 'Content-Type': 'audio/mpeg', ...cors } });
          fallos.push('[aria] ' + r.status + ': ' + (await r.text()).slice(0, 100));
        } catch (e) { fallos.push('[aria] ' + String((e && e.message) || e).slice(0, 100)); }
      }
    }

    if (!motor || motor === 'aura') {
      try {
        const r = await env.AI.run('@cf/deepgram/aura-1', { text: recorte, speaker: 'asteria' });
        return new Response(r, { headers: { 'Content-Type': 'audio/mpeg', ...cors } });
      } catch (e) { fallos.push('[aura] ' + String((e && e.message) || e).slice(0, 120)); }
    }

    if ((!motor || motor === 'groq') && env.GROQ_API_KEY) {
      const r = await fetch('https://api.groq.com/openai/v1/audio/speech', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + env.GROQ_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'canopylabs/orpheus-v1-english', voice: 'autumn',
          input: recorte, response_format: 'wav'
        })
      });
      if (r.ok) return new Response(r.body, { headers: { 'Content-Type': 'audio/wav', ...cors } });
      fallos.push('[groq] tts ' + r.status + ': ' + (await r.text()).slice(0, 120));
    }

    if (!motor || motor === 'edge') {
      try {
        const mp3 = await edgeTTS(recorte, 'en-US-AriaNeural');
        return new Response(mp3, { headers: { 'Content-Type': 'audio/mpeg', ...cors } });
      } catch (e) { fallos.push('[edge] ' + String((e && e.message) || e).slice(0, 120)); }
    }

    return json({ error: fallos.join(' | ') || 'motor desconocido' }, 502);
  }

  if (p === '/ia/oido') {
    if (!env.GROQ_API_KEY) return json({ error: 'sin clave de IA' }, 503);
    const audio = await req.arrayBuffer();
    if (!audio || audio.byteLength < 1000) return json({ error: 'sin audio' }, 400);
    if (audio.byteLength > 2 * 1024 * 1024) return json({ error: 'audio muy largo' }, 413);
    const fd = new FormData();
    fd.append('file', new File([audio], 'voz.webm', { type: req.headers.get('Content-Type') || 'audio/webm' }));
    fd.append('model', 'whisper-large-v3-turbo');
    fd.append('language', 'en');
    fd.append('temperature', '0');
    const r = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST', headers: { Authorization: 'Bearer ' + env.GROQ_API_KEY }, body: fd
    });
    if (!r.ok) return json({ error: 'oido ' + r.status + ': ' + (await r.text()).slice(0, 160) }, 502);
    const data = await r.json();
    return json({ texto: String(data.text || '').trim() });
  }

  return json({ error: 'no existe' }, 404);
}
