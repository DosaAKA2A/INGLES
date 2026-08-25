# /ia/voz: Aria (relevo en la VM de GCP) como titular, que es la voz que Dosa
# eligio y la misma de los clips pregrabados del curso. Detras quedan aura de
# Workers AI y Groq orpheus por si el relevo esta caido.
import io
from pathlib import Path

p = Path(__file__).resolve().parent.parent / 'worker' / 'worker.js'
s = io.open(p, encoding='utf-8').read()

viejo = """        const motor = url.searchParams.get('motor') || '';
        const fallos = [];

        if (!motor || motor === 'aura') {"""

nuevo = """        const motor = url.searchParams.get('motor') || '';
        const fallos = [];

        // Titular: Aria, la misma voz de los clips pregrabados del curso. La
        // sirve el relevo de la VM de GCP (voz.iris.it.com) porque Microsoft no
        // da audio a las IPs de datacenter de Cloudflare, pero si a esa VM.
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

        if (!motor || motor === 'aura') {"""

assert viejo in s
io.open(p, 'w', encoding='utf-8').write(s.replace(viejo, nuevo))
print('ok')
