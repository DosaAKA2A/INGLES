# /ia/voz con tres motores en cascada:
#   1. Workers AI de Cloudflare (deepgram aura): voz clara, sin cuentas externas.
#   2. Groq orpheus (voz autumn): el que sono "poco claro" para Dosa.
#   3. edge-tts: casi nunca sirve desde datacenter, pero es gratis intentarlo.
# El parametro ?motor= permite forzar uno para poder compararlos a oido.
import io
from pathlib import Path

p = Path(__file__).resolve().parent.parent / 'worker' / 'worker.js'
s = io.open(p, encoding='utf-8').read()

viejo = """        const recorte = String(texto).slice(0, 800);
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
              model: 'canopylabs/orpheus-v1-english', voice: 'autumn',
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

nuevo = """        const recorte = String(texto).slice(0, 800);
        // Tres motores en cascada; ?motor=aura|groq|edge fuerza uno (para
        // compararlos a oido). Titular: aura (Workers AI de Cloudflare), la voz
        // mas clara de las tres — para un estudiante el modelo tiene que ser
        // nitido. Groq orpheus de reserva, y edge-tts al final (desde
        // datacenter Microsoft no suele servir audio, pero es gratis probar).
        const motor = url.searchParams.get('motor') || '';
        const fallos = [];

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
      }"""

assert viejo in s
io.open(p, 'w', encoding='utf-8').write(s.replace(viejo, nuevo))
print('ok')
