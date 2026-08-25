/* AUDITORÍA DE AUDIO — ¿qué se queda MUDO?
   Recorre todo lo que la app puede llegar a decir en voz alta y comprueba que
   exista su clip pregrabado. Lo importante: las frases con {TU} se pregraban
   con un nombre neutro, pero en pantalla llevan el nombre REAL de la persona,
   así que se piden con un texto que no está en el manifiesto y suenan a nada
   (sin conexión no hay voz de la nube que las salve).
   Uso: node herramientas/audita-audio.js [NombreDePrueba] */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const NOMBRE = process.argv[2] || 'Eduardo';

const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(RAIZ, 'docs/datos.js'), 'utf8'), ctx);
for (let i = 1; i <= 12; i++) {
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'docs/data/u' + String(i).padStart(2, '0') + '.js'), 'utf8'), ctx);
}
const CURSO = vm.runInContext('CURSO', ctx);
const AUDIO_MAPA = new Function(fs.readFileSync(path.join(RAIZ, 'docs/audio/manifest.js'), 'utf8') + ';return AUDIO_MAPA;')();

// Igual que voz.js: clave exacta, luego 'a|', luego sin distinguir mayúsculas.
const minus = {};
for (const k in AUDIO_MAPA) minus[k.toLowerCase()] = AUDIO_MAPA[k];
function clipDe(texto, voz) {
  const c = (voz === 'b' ? 'b|' : 'a|') + texto;
  return AUDIO_MAPA[c] || AUDIO_MAPA['a|' + texto]
    || minus[c.toLowerCase()] || minus[('a|' + texto).toLowerCase()] || null;
}
// Misma regla que api.alternoDe en voz.js: sin clip exacto, se busca la
// alternativa (vocativo fuera, o el nombre neutro).
function alternoDe(texto) {
  if (!texto.includes(NOMBRE)) return null;
  const e = NOMBRE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const sinVoc = texto.replace(new RegExp(',\\s*' + e + '(?=\\s*[!?.,]|\\s*$)', 'g'), '').trim();
  if (sinVoc !== texto) return sinVoc;
  return texto.split(NOMBRE).join('Alex');
}
function hayClip(texto, voz) {
  if (clipDe(texto, voz)) return true;
  const alt = alternoDe(texto);
  return !!(alt && clipDe(alt, voz));
}

const conNombre = (t) => String(t == null ? '' : t).split('{TU}').join(NOMBRE);

// Todo lo que se manda a Voz.di, con la voz que lo dice y desde dónde.
const pide = [];
const mete = (texto, voz, donde) => {
  const t = String(texto || '').trim();
  if (t) pide.push({ texto: conNombre(t), voz: voz || 'a', donde, crudo: t });
};

function deEjercicio(ej, donde) {
  if (ej.tipo === 'escucha' || ej.tipo === 'habla') mete(ej.en, 'a', donde + ' ' + ej.tipo);
  if (ej.tipo === 'ordena') mete(ej.en, 'a', donde + ' ordena (veredicto)');
  if (ej.tipo === 'traduce') mete(ej.en[0], 'a', donde + ' traduce (veredicto)');
  if (ej.tipo === 'opcion') { mete(ej.audio, 'a', donde + ' enunciado'); mete(ej.di, 'a', donde + ' veredicto'); }
  if (ej.tipo === 'huecos') mete(ej.di || ej.opciones[ej.r], 'a', donde + ' veredicto');
  if (ej.tipo === 'parejas') ej.pares.forEach((p) => mete(p[0], 'a', donde + ' pareja'));
}

for (const u of CURSO) {
  u.vocab.forEach((v, i) => {
    const d = u.id + ' vocab#' + i + ' (' + v.en + ')';
    mete(v.en, 'a', d + ' titular');
    mete(v.ej, 'a', d + ' ejemplo');
    if (v.cambio) {
      mete(v.cambio.di, 'a', d + ' intercambio: Aria');
      mete(v.cambio.tu, 'b', d + ' intercambio: tú');
    }
  });
  for (const l of (u.lecciones || [])) {
    const d = u.id + ' ' + l.id;
    if (l.escena) l.escena.lineas.filter((x) => !x.t).forEach((x) => mete(x.en, x.q === 'B' ? 'b' : 'a', d + ' escena'));
    if (l.dialogo) {
      l.dialogo.lineas.forEach((x) => mete(x.en, x.q === 'B' ? 'b' : 'a', d + ' diálogo'));
      l.dialogo.preguntas.forEach((ej, i) => deEjercicio(ej, d + ' pregunta#' + i));
    }
    for (const [clave, lista] of [['ej', l.ejercicios], ['entiende', l.entiende], ['practica', l.practica], ['produce', l.produce]]) {
      (lista || []).forEach((ej, i) => deEjercicio(ej, d + ' ' + clave + '#' + i));
    }
    for (const m of String(l.html || '').matchAll(/<span class="ej">(.*?)<\/span>/g)) {
      mete(m[1].replace(/<[^>]+>/g, ''), 'a', d + ' explicación');
    }
  }
  (u.examen || []).forEach((ej, i) => deEjercicio(ej, u.id + ' examen#' + i));
}

const mudas = pide.filter((x) => !hayClip(x.texto, x.voz));
const conMarcador = mudas.filter((x) => x.crudo.includes('{TU}'));
const otras = mudas.filter((x) => !x.crudo.includes('{TU}'));

console.log('frases que la app puede decir: ' + pide.length);
console.log('clips en el manifiesto: ' + Object.keys(AUDIO_MAPA).length);
console.log('nombre de prueba: ' + NOMBRE + '\n');

if (conMarcador.length) {
  console.log('MUDAS POR LLEVAR EL NOMBRE DE LA PERSONA (' + conMarcador.length + '):');
  const vistas = new Set();
  for (const x of conMarcador) {
    if (vistas.has(x.crudo)) continue;
    vistas.add(x.crudo);
    console.log('  "' + x.crudo + '"  ->  se pide como "' + x.texto + '"   [' + x.donde + ']');
  }
  console.log('');
}
if (otras.length) {
  console.log('MUDAS POR OTRO MOTIVO (' + otras.length + '):');
  for (const x of otras) console.log('  [' + x.voz + '] "' + x.texto + '"   [' + x.donde + ']');
  console.log('');
}
console.log(mudas.length ? 'TOTAL MUDAS: ' + mudas.length : 'TODO SUENA');
process.exit(mudas.length ? 1 : 0);
