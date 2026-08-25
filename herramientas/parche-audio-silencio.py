# -*- coding: utf-8 -*-
# La prueba con la politica estricta de autoplay descubrio dos cosas:
#
# 1. El MP3 de silencio incrustado en base64 no era audio valido: el navegador
#    rechazaba el play() por error de descodificacion y el codigo lo tomaba por
#    "falta un gesto", asi que el desbloqueo nunca cuajaba. Ahora se ceba con un
#    clip REAL del curso a volumen 0 (dura milisegundos y ya esta en cache).
#
# 2. Habia que distinguir el bloqueo por falta de gesto (NotAllowedError) de
#    cualquier otro fallo: un 404 o un audio corrupto no deben dejar la frase
#    esperando un toque que no arregla nada.
import io
from pathlib import Path

p = Path(__file__).resolve().parent.parent / 'docs' / 'voz.js'
s = io.open(p, encoding='utf-8').read()

viejo_ini = s.index('  const SILENCIO =')
viejo_fin = s.index('  function terminaActual()')
nuevo = """  // Cebo para el desbloqueo: un clip real del curso a volumen 0. Un data:URI
  // inventado no vale — si el navegador no lo sabe descodificar, el play()
  // falla y parece que falta el gesto cuando no es eso.
  function clipCebo() {
    if (typeof AUDIO_MAPA === 'undefined') return null;
    for (const k in AUDIO_MAPA) return RUTA_AUDIO + AUDIO_MAPA[k];
    return null;
  }

  let pendiente = null;   // frase que el navegador bloqueo, esperando un gesto

  function desbloquea() {
    if (pendiente) {                       // habia algo por decir: se dice ahora
      const p = pendiente;
      pendiente = null;
      desbloqueado = true;
      reproduce(p.src, p.opciones);
      return;
    }
    if (desbloqueado) return;
    const cebo = clipCebo();
    if (!cebo) { desbloqueado = true; return; }
    desbloqueado = true;
    reproductor.volume = 0;
    reproductor.src = cebo;
    const intento = reproductor.play();
    if (intento && intento.then) {
      intento.then(() => {
        // solo se limpia si nadie puso ya una frase de verdad
        if (reproductor.volume === 0) {
          reproductor.pause(); reproductor.currentTime = 0; reproductor.volume = 1;
        }
      }).catch((e) => {
        reproductor.volume = 1;
        if (e && e.name === 'NotAllowedError') desbloqueado = false;   // aun sin permiso
      });
    }
  }
  for (const evento of ['pointerdown', 'touchstart', 'keydown']) {
    window.addEventListener(evento, desbloquea, { capture: true, passive: true });
  }

"""
s = s[:viejo_ini] + nuevo + s[viejo_fin:]

# reproduce(): volumen normal y distinguir el motivo del fallo
viejo = """  function reproduce(src, opciones) {
    calla();
    reproductor.src = src;"""
nuevo = """  function reproduce(src, opciones) {
    calla();
    reproductor.volume = 1;
    reproductor.src = src;"""
assert viejo in s, 'reproduce'
s = s.replace(viejo, nuevo)

viejo = """      intento.catch(() => {
        // el navegador exige un gesto: se guarda y suena en el proximo toque
        desbloqueado = false;
        pendiente = { src, opciones, cuando: performance.now() };
        setTimeout(() => {
          if (pendiente && performance.now() - pendiente.cuando >= 8000) { pendiente = null; terminaActual(); }
        }, 8000);
      });"""
nuevo = """      intento.catch((e) => {
        if (!e || e.name !== 'NotAllowedError') { terminaActual(); return; }   // 404, audio roto...
        // el navegador exige un gesto: se guarda y suena en el proximo toque
        desbloqueado = false;
        pendiente = { src, opciones, cuando: performance.now() };
        setTimeout(() => {
          if (pendiente && performance.now() - pendiente.cuando >= 8000) { pendiente = null; terminaActual(); }
        }, 8000);
      });"""
assert viejo in s, 'catch de reproduce'
s = s.replace(viejo, nuevo)

io.open(p, 'w', encoding='utf-8').write(s)
print('voz.js: cebo real y errores distinguidos')
