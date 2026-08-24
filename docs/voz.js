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
    calla();
    reproductor = new Audio(url);
    reproductor.playbackRate = opciones.lento ? 0.7 : 1;
    if (opciones.alTerminar) {
      alTerminarActual = opciones.alTerminar;
      reproductor.onended = reproductor.onerror = terminaActual;
    }
    reproductor.play().catch(() => terminaActual());
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
    const clave = (opciones.voz === 'b' ? 'b|' : 'a|') + texto;
    const archivo = (typeof AUDIO_MAPA !== 'undefined') && (AUDIO_MAPA[clave] || AUDIO_MAPA['a|' + texto]);
    if (archivo) { suenaMP3(archivo, opciones); return; }
    if (api.nube) {
      suenaNube(texto, opciones).then((sono) => { if (!sono) suenaSintetizador(texto, opciones); });
      return;
    }
    suenaSintetizador(texto, opciones);
  };

  api.calla = () => {
    generacion++;
    if (reproductor) { reproductor.onended = reproductor.onerror = null; reproductor.pause(); reproductor = null; }
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

  api.escucha = ({ alOir, alError, alFin }) => {
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Rec) { alError('Este navegador no trae reconocimiento de voz. Usa Chrome.'); return null; }
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
