# Parche puntual (2026-08-25): motor edge-tts en el worker para el texto
# dinamico + Groq orpheus de reserva. Se aplica una vez sobre worker/worker.js
# tal como quedo en el commit del audio pregrabado.
import io
from pathlib import Path

p = Path(__file__).resolve().parent.parent / 'worker' / 'worker.js'
s = io.open(p, encoding='utf-8').read()

marca = "// ---- principal ------------------------------------------------------------"
assert marca in s

motor = r'''// ---- voz neuronal (edge-tts) ----------------------------------------------
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
    '&Sec-MS-GEC-Version=1-130.0.2849.68&ConnectionId=' + id;
  const r = await fetch(url, {
    headers: {
      Upgrade: 'websocket',
      Origin: 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
      'Accept-Language': 'en-US'
    }
  });
  const ws = r.webSocket;
  if (!ws) throw new Error('edge-tts: sin websocket (' + r.status + ')');
  ws.accept();

  const marcaTiempo = new Date().toISOString();
  const ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>" +
    "<voice name='" + voz + "'><prosody pitch='+0Hz' rate='-10%' volume='+0%'>" +
    escapaXML(texto) + '</prosody></voice></speak>';

  const trozos = [];
  const listo = new Promise((res, rej) => {
    ws.addEventListener('message', (ev) => {
      if (typeof ev.data === 'string') {
        if (ev.data.includes('Path:turn.end')) { try { ws.close(); } catch (e) {} res(); }
        return;
      }
      // Frame binario: 2 bytes de largo de cabecera + cabecera + audio.
      const b = new Uint8Array(ev.data);
      const largo = (b[0] << 8) | b[1];
      const cabecera = new TextDecoder().decode(b.slice(2, 2 + largo));
      if (cabecera.includes('Path:audio')) trozos.push(b.slice(2 + largo));
    });
    ws.addEventListener('error', () => rej(new Error('edge-tts: fallo del socket')));
    ws.addEventListener('close', () => res());
    setTimeout(() => rej(new Error('edge-tts: no respondio a tiempo')), 15000);
  });

  ws.send('X-Timestamp:' + marcaTiempo + '\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n' +
    '{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}');
  ws.send('X-RequestId:' + id + '\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:' + marcaTiempo + '\r\nPath:ssml\r\n\r\n' + ssml);

  await listo;
  if (!trozos.length) throw new Error('edge-tts: sin audio');
  const total = trozos.reduce((n, t) => n + t.length, 0);
  const salida = new Uint8Array(total);
  let pos = 0;
  for (const t of trozos) { salida.set(t, pos); pos += t.length; }
  return salida;
}

'''

s = s.replace(marca, motor + marca)

viejo = """      if (url.pathname === '/ia/voz' && req.method === 'POST') {
        if (!env.GROQ_API_KEY) return json({ error: 'sin clave de IA' }, 503);
        const { texto } = await req.json().catch(() => ({}));
        if (!texto || String(texto).trim().length < 1) return json({ error: 'sin texto' }, 400);
        const r = await fetch('https://api.groq.com/openai/v1/audio/speech', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + env.GROQ_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'playai-tts', voice: 'Arista-PlayAI',
            input: String(texto).slice(0, 800), response_format: 'wav'
          })
        });
        if (!r.ok) return json({ error: 'tts ' + r.status + ': ' + (await r.text()).slice(0, 200) }, 502);
        return new Response(r.body, { headers: { 'Content-Type': 'audio/wav', ...cors } });
      }"""

nuevo = """      if (url.pathname === '/ia/voz' && req.method === 'POST') {
        const { texto } = await req.json().catch(() => ({}));
        if (!texto || String(texto).trim().length < 1) return json({ error: 'sin texto' }, 400);
        const recorte = String(texto).slice(0, 800);
        // Primero edge-tts: misma voz Aria que los clips pregrabados del curso.
        try {
          const mp3 = await edgeTTS(recorte, 'en-US-AriaNeural');
          return new Response(mp3, { headers: { 'Content-Type': 'audio/mpeg', ...cors } });
        } catch (e) { /* cae a Groq */ }
        // Reserva: TTS de Groq (orpheus pide aceptar sus terminos en la consola).
        if (!env.GROQ_API_KEY) return json({ error: 'sin voz disponible' }, 503);
        const r = await fetch('https://api.groq.com/openai/v1/audio/speech', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + env.GROQ_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'canopylabs/orpheus-v1-english', voice: 'tara',
            input: recorte, response_format: 'wav'
          })
        });
        if (!r.ok) return json({ error: 'tts ' + r.status + ': ' + (await r.text()).slice(0, 200) }, 502);
        return new Response(r.body, { headers: { 'Content-Type': 'audio/wav', ...cors } });
      }"""

assert viejo in s
s = s.replace(viejo, nuevo)
io.open(p, 'w', encoding='utf-8').write(s)
print('parche aplicado')
