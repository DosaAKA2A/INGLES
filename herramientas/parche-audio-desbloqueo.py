# -*- coding: utf-8 -*-
# "A veces tengo que darle click para que hable": el navegador solo deja sonar
# audio que nace de un gesto del usuario. El saludo del tutor suena al abrir la
# vista (sin gesto) y su respuesta llega despues de una peticion a la red, para
# entonces el permiso del gesto ya caduco.
#
# Solucion estandar: UN solo elemento <audio>, desbloqueado en el primer toque
# de la sesion (se le da play a un silencio y se pausa). A partir de ahi basta
# con cambiarle el src: el elemento ya tiene permiso y suena aunque el sonido
# llegue tarde. Si aun asi el navegador se niega, se avisa por CSS en vez de
# quedarse mudo sin explicacion.
import io
from pathlib import Path

p = Path(__file__).resolve().parent.parent / 'docs' / 'voz.js'
s = io.open(p, encoding='utf-8').read()

viejo = """  // ---- 1. MP3 pregrabados ----

  let reproductor = null;
  let alTerminarActual = null;

  function terminaActual() {
    if (alTerminarActual) { const f = alTerminarActual; alTerminarActual = null; f(); }
  }

  function suenaMP3(archivo, opciones) {
    calla();
    reproductor = new Audio(RUTA_AUDIO + archivo);
    reproductor.playbackRate = opciones.lento ? 0.7 : 1;
    if (opciones.alTerminar) {
      alTerminarActual = opciones.alTerminar;
      reproductor.onended = reproductor.onerror = terminaActual;
    }
    reproductor.play().catch(() => terminaActual());
  }"""

nuevo = """  // ---- 1. MP3 pregrabados ----

  // UN solo reproductor para toda la app. Crear un Audio nuevo por frase hacia
  // que el navegador lo tratara como reproduccion "sin gesto" y la bloqueara:
  // por eso a veces habia que tocar el mensaje para oirlo. Este se desbloquea
  // en el primer toque de la sesion y luego solo se le cambia el src.
  const reproductor = new Audio();
  reproductor.preload = 'auto';
  let alTerminarActual = null;
  let desbloqueado = false;

  const SILENCIO = 'data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA'
    + 'gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgP////////////////////////////////8AAAA5'
    + 'TEFNRTMuMTAwAc0AAAAAAAAAABSAJAJAQgAAgAAAAnGMUAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFN'
    + 'RTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

  function desbloquea() {
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
  }

  function terminaActual() {
    if (alTerminarActual) { const f = alTerminarActual; alTerminarActual = null; f(); }
  }

  function reproduce(src, opciones) {
    calla();
    reproductor.src = src;
    reproductor.playbackRate = opciones.lento ? 0.7 : 1;
    reproductor.onended = reproductor.onerror = null;
    if (opciones.alTerminar) {
      alTerminarActual = opciones.alTerminar;
      reproductor.onended = reproductor.onerror = terminaActual;
    }
    const intento = reproductor.play();
    if (intento && intento.catch) {
      intento.catch(() => {
        // el navegador lo bloqueo: se avisa para que se pueda tocar y oir
        document.body.classList.add('audio-bloqueado');
        terminaActual();
      });
    }
  }

  function suenaMP3(archivo, opciones) {
    reproduce(RUTA_AUDIO + archivo, opciones);
  }"""
assert viejo in s, 'bloque 1'
s = s.replace(viejo, nuevo)

viejo = """  function suenaMP3es(url, opciones) {
    calla();
    reproductor = new Audio(url);
    reproductor.playbackRate = opciones.lento ? 0.7 : 1;
    if (opciones.alTerminar) {
      alTerminarActual = opciones.alTerminar;
      reproductor.onended = reproductor.onerror = terminaActual;
    }
    reproductor.play().catch(() => terminaActual());
  }"""
nuevo = """  function suenaMP3es(url, opciones) {
    reproduce(url, opciones);
  }"""
assert viejo in s, 'bloque 2'
s = s.replace(viejo, nuevo)

viejo = """  api.calla = () => {
    generacion++;
    if (reproductor) { reproductor.onended = reproductor.onerror = null; reproductor.pause(); reproductor = null; }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    terminaActual();
  };"""
nuevo = """  api.calla = () => {
    generacion++;
    reproductor.onended = reproductor.onerror = null;
    try { reproductor.pause(); } catch (e) { /* aun sin src */ }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    terminaActual();
  };"""
assert viejo in s, 'bloque 3'
s = s.replace(viejo, nuevo)

io.open(p, 'w', encoding='utf-8').write(s)
print('voz.js: reproductor unico y desbloqueo por gesto')
