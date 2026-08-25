# -*- coding: utf-8 -*-
# Afina el desbloqueo de audio:
#  - el silencio de desbloqueo no puede pisar un sonido que ya empezo
#  - si el navegador bloquea una frase, se recuerda y suena en el siguiente
#    toque del usuario (dentro de 8 s), en vez de perderse en silencio
import io
from pathlib import Path

p = Path(__file__).resolve().parent.parent / 'docs' / 'voz.js'
s = io.open(p, encoding='utf-8').read()

viejo = """  function desbloquea() {
    if (desbloqueado) return;
    desbloqueado = true;
    const antes = reproductor.src;
    reproductor.src = SILENCIO;
    const intento = reproductor.play();
    if (intento && intento.then) {
      intento.then(() => { reproductor.pause(); reproductor.currentTime = 0; if (antes) reproductor.src = antes; })
        .catch(() => { desbloqueado = false; });   // se reintenta en el proximo gesto
    }
  }
  for (const evento of ['pointerdown', 'touchstart', 'keydown']) {
    window.addEventListener(evento, desbloquea, { capture: true, once: false, passive: true });
  }"""

nuevo = """  let pendiente = null;   // frase que el navegador bloqueo, esperando un gesto

  function desbloquea() {
    if (pendiente) {                       // habia algo por decir: se dice ahora
      const p = pendiente;
      pendiente = null;
      desbloqueado = true;
      reproduce(p.src, p.opciones);
      return;
    }
    if (desbloqueado) return;
    desbloqueado = true;
    reproductor.src = SILENCIO;
    const intento = reproductor.play();
    if (intento && intento.then) {
      intento.then(() => {
        // solo se limpia si nadie puso ya una frase de verdad
        if (reproductor.src === SILENCIO) { reproductor.pause(); reproductor.currentTime = 0; }
      }).catch(() => { desbloqueado = false; });   // se reintenta en el proximo gesto
    }
  }
  for (const evento of ['pointerdown', 'touchstart', 'keydown']) {
    window.addEventListener(evento, desbloquea, { capture: true, passive: true });
  }"""
assert viejo in s, 'bloque desbloqueo'
s = s.replace(viejo, nuevo)

viejo = """    const intento = reproductor.play();
    if (intento && intento.catch) {
      intento.catch(() => {
        // el navegador lo bloqueo: se avisa para que se pueda tocar y oir
        document.body.classList.add('audio-bloqueado');
        terminaActual();
      });
    }
  }"""
nuevo = """    const intento = reproductor.play();
    if (intento && intento.catch) {
      intento.catch(() => {
        // el navegador exige un gesto: se guarda y suena en el proximo toque
        desbloqueado = false;
        pendiente = { src, opciones, cuando: performance.now() };
        setTimeout(() => {
          if (pendiente && performance.now() - pendiente.cuando >= 8000) { pendiente = null; terminaActual(); }
        }, 8000);
      });
    }
  }"""
assert viejo in s, 'bloque reintento'
s = s.replace(viejo, nuevo)

io.open(p, 'w', encoding='utf-8').write(s)
print('voz.js: reintento en el siguiente gesto')
