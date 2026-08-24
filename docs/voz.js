/* INGLES — voz: síntesis (escuchar inglés) y reconocimiento (evaluar
   pronunciación). Todo con lo que trae el navegador, sin servicios de pago.

   Síntesis: speechSynthesis con una voz en-US. En Chrome las voces "Google"
   son remotas y suenan mucho mejor que las locales de Windows; se prefieren.
   Las voces cargan tarde y a veces la lista llega vacía la primera vez, por
   eso se escucha onvoiceschanged y se resuelve perezosamente.

   Reconocimiento: webkitSpeechRecognition (Chrome). Devuelve el texto oído y
   la nota se calcula comparando palabra a palabra contra la frase esperada. */

const Voz = (() => {
  let vozEN = null;
  let vozEN2 = null; // segunda voz distinta para el interlocutor B de los diálogos

  function eligeVoces() {
    const voces = speechSynthesis.getVoices().filter((v) => v.lang && v.lang.startsWith('en'));
    if (!voces.length) return;
    const remotas = voces.filter((v) => !v.localService);
    const orden = (lista) => lista.sort((a, b) => {
      const pa = (a.name.includes('Google') ? 0 : 1) + (a.lang === 'en-US' ? 0 : .5);
      const pb = (b.name.includes('Google') ? 0 : 1) + (b.lang === 'en-US' ? 0 : .5);
      return pa - pb;
    });
    const mejor = orden(remotas.length ? remotas : voces);
    vozEN = mejor[0];
    vozEN2 = mejor.find((v) => v !== vozEN && v.lang !== vozEN.lang) ||
             mejor.find((v) => v !== vozEN) || vozEN;
  }
  eligeVoces();
  if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = eligeVoces;

  let alTerminarActual = null;

  function di(texto, opciones = {}) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    if (alTerminarActual) { alTerminarActual(); alTerminarActual = null; }
    if (!vozEN) eligeVoces();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'en-US';
    if (opciones.voz === 'b' && vozEN2) u.voice = vozEN2;
    else if (vozEN) u.voice = vozEN;
    u.rate = opciones.lento ? 0.65 : (opciones.rate || 0.92);
    u.pitch = 1;
    if (opciones.alTerminar) {
      alTerminarActual = opciones.alTerminar;
      u.onend = u.onerror = () => {
        if (alTerminarActual === opciones.alTerminar) alTerminarActual = null;
        opciones.alTerminar();
      };
    }
    speechSynthesis.speak(u);
  }

  function calla() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (alTerminarActual) { alTerminarActual(); alTerminarActual = null; }
  }

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

  function normaliza(texto) {
    let t = String(texto).toLowerCase()
      .replace(/’/g, "'")
      .replace(/[^a-z0-9' ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    for (const [re, a] of CONTRACCIONES) t = t.replace(re, a);
    return t;
  }

  // Nota 0-100: proporción de palabras esperadas que aparecieron, en orden
  // (subsecuencia común más larga, que perdona una palabra comida sin
  // desalinear todo el resto).
  function notaPronunciacion(esperado, oido) {
    const a = normaliza(esperado).split(' ').filter(Boolean);
    const b = normaliza(oido).split(' ').filter(Boolean);
    if (!a.length) return 0;
    const f = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        f[i][j] = a[i - 1] === b[j - 1] ? f[i - 1][j - 1] + 1 : Math.max(f[i - 1][j], f[i][j - 1]);
      }
    }
    return Math.round((f[a.length][b.length] / a.length) * 100);
  }

  function escucha({ alOir, alError, alFin }) {
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
  }

  return { di, calla, escucha, normaliza, notaPronunciacion, TIENE_MIC };
})();
