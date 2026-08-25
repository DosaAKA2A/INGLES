/* INGLES — voz: reproducir inglés y evaluar pronunciación.

   Orden al hablar:
   1. MP3 pregrabado con voz neuronal (docs/audio/, generado con edge-tts):
      cubre TODO el contenido fijo del curso y suena humano.
   2. Voz de la nube (Voz.nube, el worker con Groq TTS) para texto dinámico
      (chat, ensayos corregidos), si está conectada.
   3. speechSynthesis del navegador como último recurso. Ojo: en esta máquina
      el navegador elegía una voz en ESPAÑOL para texto inglés ("Hi" sonaba
      "i"), así que solo se usa si hay una voz en-* de verdad; se reintenta
      cuando la lista de voces termina de cargar.

   Reconocimiento: webkitSpeechRecognition (Chrome). La nota compara palabra a
   palabra contra la frase esperada. */

const Voz = (() => {
  const RUTA_AUDIO = 'audio/';

  // ---- 1. MP3 pregrabados ----

  // UN solo reproductor para toda la app. Crear un Audio nuevo por frase hacia
  // que el navegador lo tratara como reproduccion "sin gesto" y la bloqueara:
  // por eso a veces habia que tocar el mensaje para oirlo. Este se desbloquea
  // en el primer toque de la sesion y luego solo se le cambia el src.
  const reproductor = new Audio();
  reproductor.preload = 'auto';
  let alTerminarActual = null;
  let desbloqueado = false;

  // Cebo para el desbloqueo: un clip real del curso a volumen 0. Un data:URI
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

  function terminaActual() {
    if (alTerminarActual) { const f = alTerminarActual; alTerminarActual = null; f(); }
  }

  function reproduce(src, opciones) {
    calla();
    reproductor.volume = 1;
    reproductor.src = src;
    reproductor.playbackRate = opciones.lento ? 0.7 : 1;
    reproductor.onended = reproductor.onerror = null;
    if (opciones.alTerminar) {
      alTerminarActual = opciones.alTerminar;
      reproductor.onended = reproductor.onerror = terminaActual;
    }
    const intento = reproductor.play();
    if (intento && intento.catch) {
      intento.catch((e) => {
        if (!e || e.name !== 'NotAllowedError') { terminaActual(); return; }   // 404, audio roto...
        // el navegador exige un gesto: se guarda y suena en el proximo toque
        desbloqueado = false;
        pendiente = { src, opciones, cuando: performance.now() };
        setTimeout(() => {
          if (pendiente && performance.now() - pendiente.cuando >= 8000) { pendiente = null; terminaActual(); }
        }, 8000);
      });
    }
  }

  function suenaMP3(archivo, opciones) {
    reproduce(RUTA_AUDIO + archivo, opciones);
  }

  // ---- 2. voz de la nube (se engancha desde app.js cuando hay pase) ----

  // Voz.nube = async (texto) => urlDeObjeto | null
  const cacheNube = new Map();
  let generacion = 0; // para descartar audios que llegan tarde tras un calla()

  async function suenaNube(texto, opciones) {
    const gen = ++generacion;
    let url = cacheNube.get(texto);
    if (url === undefined) {
      try { url = await api.nube(texto); } catch (e) { url = null; }
      cacheNube.set(texto, url);
    }
    if (gen !== generacion) return true;       // ya pidieron otra cosa
    if (!url) return false;
    suenaMP3es(url, opciones);
    return true;
  }

  function suenaMP3es(url, opciones) {
    reproduce(url, opciones);
  }

  // ---- 3. speechSynthesis, solo con una voz inglesa de verdad ----

  let vozEN = null;

  function eligeVoz() {
    if (!('speechSynthesis' in window)) return;
    const voces = speechSynthesis.getVoices().filter((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
    if (!voces.length) return;
    voces.sort((x, y) => {
      const p = (v) => (v.name.includes('Google') ? 0 : 2) + (v.lang === 'en-US' ? 0 : 1);
      return p(x) - p(y);
    });
    vozEN = voces[0];
  }
  eligeVoz();
  if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = eligeVoz;

  function suenaSintetizador(texto, opciones) {
    if (!('speechSynthesis' in window)) { if (opciones.alTerminar) opciones.alTerminar(); return; }
    speechSynthesis.cancel();
    if (!vozEN) eligeVoz();
    // Sin voz inglesa instalada, mejor callar: la voz por defecto de esta
    // maquina es espanola y leia "Hi" como "i". Silencio antes que eso.
    if (!vozEN) { if (opciones.alTerminar) opciones.alTerminar(); return; }
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'en-US';
    if (vozEN) u.voice = vozEN;
    u.rate = opciones.lento ? 0.65 : 1;
    if (opciones.alTerminar) {
      alTerminarActual = opciones.alTerminar;
      u.onend = u.onerror = terminaActual;
    }
    speechSynthesis.speak(u);
  }

  // ---- entrada única ----

  const api = {};

  api.nube = null; // app.js lo define cuando hay conexión

  api.di = (texto, opciones = {}) => {
    texto = String(texto).trim();
    // por si algun sitio manda el marcador sin resolver
    if (texto.includes('{TU}') && typeof conNombre === 'function') texto = conNombre(texto);
    // `dinamico` salta los pregrabados: el tutor de Conversar habla SIEMPRE con
    // la voz de la nube, para que el saludo y las respuestas sean la misma voz.
    const clave = (opciones.voz === 'b' ? 'b|' : 'a|') + texto;
    const archivo = !opciones.dinamico && (typeof AUDIO_MAPA !== 'undefined') && (AUDIO_MAPA[clave] || AUDIO_MAPA['a|' + texto]);
    if (archivo) { suenaMP3(archivo, opciones); return; }
    if (api.nube) {
      suenaNube(texto, opciones).then((sono) => { if (!sono) suenaSintetizador(texto, opciones); });
      return;
    }
    suenaSintetizador(texto, opciones);
  };

  api.calla = () => {
    generacion++;
    reproductor.onended = reproductor.onerror = null;
    try { reproductor.pause(); } catch (e) { /* aun sin src */ }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    terminaActual();
  };
  function calla() { api.calla(); }

  // ---- reconocimiento ----

  const TIENE_MIC = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  // "I'm" y "I am" son la misma respuesta hablada: se normaliza antes de comparar.
  const CONTRACCIONES = [
    [/\bi'm\b/g, 'i am'], [/\byou're\b/g, 'you are'], [/\bhe's\b/g, 'he is'],
    [/\bshe's\b/g, 'she is'], [/\bit's\b/g, 'it is'], [/\bwe're\b/g, 'we are'],
    [/\bthey're\b/g, 'they are'], [/\bisn't\b/g, 'is not'], [/\baren't\b/g, 'are not'],
    [/\bdon't\b/g, 'do not'], [/\bdoesn't\b/g, 'does not'], [/\bcan't\b/g, 'cannot'],
    [/\bwon't\b/g, 'will not'], [/\bdidn't\b/g, 'did not'], [/\bwasn't\b/g, 'was not'],
    [/\bweren't\b/g, 'were not'], [/\bwhat's\b/g, 'what is'], [/\bwhere's\b/g, 'where is'],
    [/\bthere's\b/g, 'there is'], [/\blet's\b/g, 'let us'], [/\bi've\b/g, 'i have'],
    [/\bi'll\b/g, 'i will'], [/\bthat's\b/g, 'that is'], [/\bhaven't\b/g, 'have not']
  ];

  api.normaliza = (texto) => {
    let t = String(texto).toLowerCase()
      .replace(/’/g, "'")
      .replace(/[^a-z0-9' ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    for (const [re, a] of CONTRACCIONES) t = t.replace(re, a);
    return t;
  };

  // Nota 0-100: proporción de palabras esperadas que aparecieron, en orden
  // (subsecuencia común más larga, que perdona una palabra comida sin
  // desalinear todo el resto).
  api.notaPronunciacion = (esperado, oido) => {
    const a = api.normaliza(esperado).split(' ').filter(Boolean);
    const b = api.normaliza(oido).split(' ').filter(Boolean);
    if (!a.length) return 0;
    const f = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        f[i][j] = a[i - 1] === b[j - 1] ? f[i - 1][j - 1] + 1 : Math.max(f[i - 1][j], f[i][j - 1]);
      }
    }
    return Math.round((f[a.length][b.length] / a.length) * 100);
  };

  // Oido titular: grabar el microfono y transcribir con Whisper via el worker
  // (api.oido lo engancha app.js con el pase). El SpeechRecognition del
  // navegador queda de reserva: depende del servicio de Google y en varios
  // entornos no arranca ni avisa — "no me detecta el microfono".
  api.oido = null;

  function escuchaGrabando({ alOir, alError, alFin }) {
    let rec = null, corriente = null, cancelado = false, ctx = null;
    const trozos = [];

    const termina = (oyoAlgo) => { if (alFin) alFin(oyoAlgo); };
    const cierra = () => {
      try { if (corriente) corriente.getTracks().forEach((t) => t.stop()); } catch (e) {}
      try { if (ctx) ctx.close(); } catch (e) {}
    };

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      if (cancelado) { stream.getTracks().forEach((t) => t.stop()); return; }
      corriente = stream;
      const tipo = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus'
        : (MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : '');
      rec = new MediaRecorder(stream, tipo ? { mimeType: tipo } : undefined);
      rec.ondataavailable = (e) => { if (e.data && e.data.size) trozos.push(e.data); };
      rec.onstop = async () => {
        cierra();
        if (cancelado) { termina(false); return; }
        const blob = new Blob(trozos, { type: rec.mimeType || 'audio/webm' });
        if (blob.size < 2000) { alError('No se grabó nada. Habla más cerca del micrófono.'); termina(false); return; }
        try {
          const texto = await api.oido(blob);
          if (texto) { alOir([texto]); termina(true); }
          else { alError('No se pudo transcribir. Revisa la conexión e intenta de nuevo.'); termina(false); }
        } catch (e) { alError('No se pudo transcribir: ' + e.message); termina(false); }
      };
      rec.start(250);

      // corte automatico: 1,4 s de silencio despues de haber hablado, o 9 s en total
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const fuente = ctx.createMediaStreamSource(stream);
      const analizador = ctx.createAnalyser();
      analizador.fftSize = 512;
      fuente.connect(analizador);
      const datos = new Uint8Array(analizador.fftSize);
      let hablo = false, silencio = 0;
      const arranque = Date.now();
      const vigila = setInterval(() => {
        if (!rec || rec.state !== 'recording') { clearInterval(vigila); return; }
        analizador.getByteTimeDomainData(datos);
        let s2 = 0;
        for (let i = 0; i < datos.length; i++) { const v = (datos[i] - 128) / 128; s2 += v * v; }
        const rms = Math.sqrt(s2 / datos.length);
        if (rms > 0.02) { hablo = true; silencio = 0; } else if (hablo) { silencio += 120; }
        if ((hablo && silencio >= 1400) || Date.now() - arranque > 9000) { clearInterval(vigila); rec.stop(); }
      }, 120);
    }).catch((e) => {
      if (e && (e.name === 'NotAllowedError' || e.name === 'SecurityError')) {
        alError('Sin permiso de micrófono. Dáselo en el candado de la barra de direcciones y recarga.');
      } else if (e && e.name === 'NotFoundError') {
        alError('El navegador no encuentra ningún micrófono conectado.');
      } else {
        alError('No se pudo abrir el micrófono: ' + ((e && e.name) || e));
      }
      termina(false);
    });

    return {
      stop() { try { if (rec && rec.state === 'recording') rec.stop(); } catch (e) {} },
      abort() { cancelado = true; try { if (rec && rec.state === 'recording') rec.stop(); } catch (e) {} cierra(); }
    };
  }

  api.escucha = ({ alOir, alError, alFin }) => {
    if (api.oido && navigator.mediaDevices && window.MediaRecorder) {
      return escuchaGrabando({ alOir, alError, alFin });
    }
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Rec) { alError('Este navegador no trae reconocimiento de voz. Conéctate con el pase (Ajustes) para usar el oído del curso.'); return null; }
    const rec = new Rec();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    let oyoAlgo = false;
    rec.onresult = (ev) => {
      oyoAlgo = true;
      const alternativas = Array.from(ev.results[0]).map((r) => r.transcript);
      alOir(alternativas);
    };
    rec.onerror = (ev) => {
      if (ev.error === 'not-allowed') alError('Sin permiso de micrófono. Dáselo en el candado de la barra de direcciones.');
      else if (ev.error === 'no-speech') alError('No se oyó nada. Intenta de nuevo, más cerca del micrófono.');
      else if (ev.error !== 'aborted') alError('Fallo del micrófono: ' + ev.error);
    };
    rec.onend = () => { if (alFin) alFin(oyoAlgo); };
    rec.start();
    return rec;
  };

  api.TIENE_MIC = TIENE_MIC;
  return api;
})();
