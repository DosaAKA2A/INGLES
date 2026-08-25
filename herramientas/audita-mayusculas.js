/* AUDITORÍA DE MAYÚSCULAS — términos en inglés citados dentro de texto en
   español. La regla de la casa (Dosa, repetida varias veces): un término en
   inglés que se le muestra al alumno va SIEMPRE con mayúscula inicial, esté
   donde esté de la frase — "Andrew dice Hi y no Hello", no "dice hi".

   Revisa todos los textos en español del curso (enunciados, opciones, uso,
   nota, por, subtítulos, lugar de la escena...) y lista cada término del
   vocabulario que aparezca en minúscula.
   Uso: node herramientas/audita-mayusculas.js */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(RAIZ, 'docs/datos.js'), 'utf8'), ctx);
for (let i = 1; i <= 12; i++) {
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'docs/data/u' + String(i).padStart(2, '0') + '.js'), 'utf8'), ctx);
}
const CURSO = vm.runInContext('CURSO', ctx);
// LA MISMA funcion que usa la pantalla (vive en docs/datos.js): asi el informe
// dice lo que de verdad se ve, no lo que hay escrito en el dato.
const terminos = vm.runInContext('terminos', ctx);

// El vocabulario inglés de todo el curso, de más largo a más corto para que
// "good morning" gane a "good".
const TERMINOS = [];
for (const u of CURSO) {
  for (const v of u.vocab) TERMINOS.push(String(v.en).trim());
  for (const l of (u.lecciones || [])) for (const w of (l.regalos || [])) TERMINOS.push(String(w).trim());
}
// Palabras que en español también existen o son demasiado ambiguas para
// exigirles mayúscula dentro de una frase.
const AMBIGUAS = new Set(['no', 'a', 'an', 'the', 'me', 'i', 'o', 'in', 'as', 'so', 'con', 'red', 'sale', 'come', 'toe', 'van', 'sea', 'ten', 'once', 'cola', 'pan', 'mar', 'sin', 'ha', 'son', 'ser', 'ir', 'da', 'de', 'la', 'el', 'un', 'y', 'es', 'en', 'te', 'se']);

// Misma marca de "esto es espanol" que app.js: si el texto esta en ingles, sus
// palabras interiores NO deben capitalizarse y no se revisan.
const MARCA_ES = /[áéíóúñ¿¡]|\b(el|la|los|las|un|una|del|que|para|con|por|pero|como|cuando|donde|es|son|se|su|sus|al|lo|si|ya|muy|mas|solo|forma|frase|palabra|dice|significa|responde|amigos|primera|cada|nunca|siempre|antes|despues|tambien|entre|sirve|usa|vale|va|van)\b/i;
const LISTA = [...new Set(TERMINOS)]
  .filter((t) => t.length > 1 && !AMBIGUAS.has(t.toLowerCase()))
  .sort((a, b) => b.length - a.length);

const fallos = [];

function revisa(texto, donde) {
  if (!texto) return;
  // fuera el HTML y lo que va entre comillas de cita (ahí ya se ve el término
  // tal cual lo escribió el autor, y suele ser correcto)
  // se audita el texto YA PINTADO
  const plano = terminos(String(texto)).replace(/<[^>]+>/g, '');
  if (!MARCA_ES.test(plano)) return;              // texto en ingles: no se toca
  for (const t of LISTA) {
    if (t !== t.toLowerCase()) continue;           // el término ya lleva mayúsculas propias
    const esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('(^|[^\\p{L}])(' + esc + ')(?![\\p{L}])', 'giu');
    let m;
    while ((m = re.exec(plano)) !== null) {
      const hallado = m[2];
      if (hallado[0] === hallado[0].toUpperCase()) continue;   // ya va bien
      const antes = plano.slice(0, m.index + m[1].length);
      // si es la primera letra de la frase, de eso ya se encarga mayus()
      if (!antes.replace(/[\s"«»(¿¡]/g, '')) continue;
      fallos.push({ donde, termino: hallado, frase: plano.trim().slice(0, 96) });
      break;
    }
  }
}

// Como pinta la app una opcion: `literal` -> tal cual; si no, primera letra en
// mayuscula y terminos ingleses capitalizados. Si dos opciones acaban IGUALES,
// el ejercicio no tiene respuesta posible y le falta `literal: true`.
const RE_LETRA = new RegExp('[a-zA-ZÀ-ɏ]');
function pintaOpcion(ej, o) {
  if (ej.tipo === 'huecos' || ej.literal) return String(o);
  const t = terminos(String(o));
  const j = t.search(RE_LETRA);
  return j < 0 ? t : t.slice(0, j) + t.charAt(j).toUpperCase() + t.slice(j + 1);
}

const chocan = [];
function revisaOpciones(ej, donde) {
  if (ej.tipo !== 'opcion' || !ej.opciones) return;
  const vistas = new Map();
  ej.opciones.forEach((o, k) => {
    const pintada = pintaOpcion(ej, o);
    if (vistas.has(pintada)) chocan.push({ donde: donde, texto: pintada, cuales: vistas.get(pintada) + ' y ' + k });
    else vistas.set(pintada, k);
  });
}

function deEjercicio(ej, donde) {
  revisaOpciones(ej, donde);
  revisa(ej.q, donde + ' enunciado');
  (ej.opciones || []).forEach((o, i) => { if (ej.tipo !== 'huecos') revisa(o, donde + ' opción#' + i); });
  revisa(ej.por, donde + ' porqué');
  revisa(ej.es, donde + ' consigna');
  revisa(ej.antes, donde + ' antes');
  revisa(ej.despues, donde + ' después');
  (ej.pares || []).forEach((p, i) => revisa(p[1], donde + ' pareja#' + i));
  revisa(ej.nota, donde + ' nota');
}

for (const u of CURSO) {
  revisa(u.descripcion, u.id + ' descripción');
  u.vocab.forEach((v, i) => {
    const d = u.id + ' vocab#' + i + ' (' + v.en + ')';
    revisa(v.uso, d + ' uso');
    revisa(v.nota, d + ' nota');
    revisa(v.es, d + ' traducción');
  });
  for (const l of (u.lecciones || [])) {
    const d = u.id + ' ' + l.id;
    revisa(l.titulo, d + ' título');
    revisa(l.sub, d + ' subtítulo');
    if (l.escena) { revisa(l.escena.titulo, d + ' escena título'); revisa(l.escena.lugar, d + ' escena lugar'); }
    if (l.dialogo) {
      revisa(l.dialogo.titulo, d + ' diálogo título');
      l.dialogo.lineas.forEach((x, i) => revisa(x.es, d + ' diálogo línea#' + i));
      l.dialogo.preguntas.forEach((ej, i) => deEjercicio(ej, d + ' pregunta#' + i));
    }
    if (l.escena) l.escena.lineas.forEach((x, i) => { if (x.es) revisa(x.es, d + ' escena línea#' + i); });
    for (const [c, lista] of [['ej', l.ejercicios], ['entiende', l.entiende], ['practica', l.practica], ['produce', l.produce]]) {
      (lista || []).forEach((ej, i) => deEjercicio(ej, d + ' ' + c + '#' + i));
    }
  }
  (u.examen || []).forEach((ej, i) => deEjercicio(ej, u.id + ' examen#' + i));
  if (u.ensayo) revisa(u.ensayo.consigna, u.id + ' ensayo');
}

console.log('términos vigilados: ' + LISTA.length + '\n');
if (chocan.length) {
  console.log('OPCIONES QUE SE VEN IGUALES AL PINTARSE (les falta `literal: true`):');
  for (const c of chocan) console.log('  ' + c.donde + ': "' + c.texto + '" (opciones ' + c.cuales + ')');
  console.log('');
}
for (const f of fallos) console.log('  ' + f.donde + ': "' + f.termino + '" en → ' + f.frase);
const total = fallos.length + chocan.length;
if (!total) { console.log('MAYÚSCULAS CORRECTAS Y NINGUNA OPCIÓN REPETIDA'); process.exit(0); }
console.log(String.fromCharCode(10) + 'TOTAL: ' + total);
process.exit(1);
