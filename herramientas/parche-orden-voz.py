# /ia/voz: Groq (orpheus) primero y edge-tts de reserva. Edge desde el worker
# hace el handshake pero Microsoft no le sirve audio a IPs de datacenter
# (comprobado 2026-08-25: turn.start/turn.end llegan, binario nunca), asi que
# solo estorbaba metiendo latencia antes del fallback.
import io
from pathlib import Path

p = Path(__file__).resolve().parent.parent / 'worker' / 'worker.js'
s = io.open(p, encoding='utf-8').read()

viejo = """        const recorte = String(texto).slice(0, 800);
        // Primero edge-tts: misma voz Aria que los clips pregrabados del curso.
        let edgeErr = '';
        try {
          const mp3 = await edgeTTS(recorte, 'en-US-AriaNeural');
          return new Response(mp3, { headers: { 'Content-Type': 'audio/mpeg', ...cors } });
        } catch (e) { edgeErr = String((e && e.message) || e); }
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
        if (!r.ok) return json({ error: '[edge] ' + edgeErr + ' | [groq] tts ' + r.status + ': ' + (await r.text()).slice(0, 160) }, 502);
        return new Response(r.body, { headers: { 'Content-Type': 'audio/wav', ...cors } });
      }"""

nuevo = """        const recorte = String(texto).slice(0, 800);
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
      }"""

assert viejo in s
io.open(p, 'w', encoding='utf-8').write(s.replace(viejo, nuevo))
print('ok')
