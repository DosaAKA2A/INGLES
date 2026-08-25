/* AUDITORÍA DE RESPUESTAS — ¿puede el alumno acertar?
   Comprueba, ejercicio por ejercicio, que la respuesta que se le pide sea la
   que se le acepta. Los tres fallos que busca:

   1. NOMBRE FIJO. La consigna dice "Yo soy {TU}." (que en pantalla es "Yo soy
      Eduardo.") pero la respuesta aceptada lleva un nombre escrito a mano
      ("i am dosa"). Escribas lo que escribas, fallas.
   2. MARCADOR DESPAREJADO. La consigna lleva {TU} y la respuesta no, o al
      revés: con cualquier nombre que no sea el del autor, no encaja.
   3. RESPUESTA VACÍA o sin alternativas para las contracciones habituales.

   Uso: node herramientas/audita-respuestas.js */

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

// Nombres propios de personas que NUNCA deben estar escritos a mano en una
// respuesta que el alumno tiene que teclear: o es {TU}, o es un personaje que
// aparece en la propia consigna.
const PERSONAJES = new Set(['aria', 'andrew']);
const SOSPECHOSOS = /\b(dosa|alex|eduardo|ana|tom)\b/i;

const fallos = [];
const anota = (donde, que) => fallos.push(donde + ': ' + que);

// El enunciado te habla a TI: entonces la respuesta correcta se presenta con
// TU nombre, no con el de un personaje del curso.
const NOMBRES_PJ = ['Aria', 'Andrew', 'Ana', 'Tom'];
function revisaPersona(ej, donde) {
  if (ej.tipo !== 'opcion' || !ej.opciones) return;
  const q = String(ej.q || '');
  const teHabla = /te (preguntan|dicen|saludan)/i.test(q) || /qu[eé] (respondes|dices|contestas)/i.test(q);
  if (!teHabla) return;
  const correcta = String(ej.opciones[ej.r] || '');
  const m = correcta.match(/(my name is|i am|i'm)\s+([A-Za-z]+)/i);
  if (!m) return;
  const nombre = m[2];
  if (nombre === '{TU}') return;
  if (!NOMBRES_PJ.includes(nombre)) return;    // 'I'm fine' y demas, no es un nombre
  anota(donde, 'te preguntan a TI pero la respuesta se presenta como "' + nombre + '" → "' + correcta + '"');
}

function revisa(ej, donde) {
  revisaPersona(ej, donde);
  // solo los que el alumno PRODUCE tecleando o hablando
  const esperadas = ej.tipo === 'traduce' ? (ej.en || [])
    : (ej.tipo === 'escucha' || ej.tipo === 'ordena' || ej.tipo === 'habla') ? [ej.en] : null;
  if (!esperadas) return;

  if (!esperadas.length || esperadas.some((x) => !String(x || '').trim())) {
    anota(donde, 'sin respuesta esperada');
    return;
  }

  const consignaTexto = String(ej.es || ej.q || '');
  for (const r of esperadas) {
    const t = String(r);
    const m = t.match(SOSPECHOSOS);
    if (!m) continue;
    const n = m[1];
    // vale si es un personaje del curso o si el nombre esta en la propia
    // consigna ("el gato de Ana"): ahi no es el alumno quien se nombra
    if (PERSONAJES.has(n.toLowerCase())) continue;
    if (consignaTexto.toLowerCase().includes(n.toLowerCase())) continue;
    anota(donde, 'la respuesta lleva un nombre fijo ("' + n + '") en vez de {TU} → "' + t + '"');
  }

  // la consigna y la respuesta tienen que llevar el marcador a la vez
  const consigna = String(ej.es || '');
  const consignaTU = consigna.includes('{TU}');
  const respuestaTU = esperadas.some((x) => String(x).includes('{TU}'));
  if (consignaTU && !respuestaTU) {
    anota(donde, 'la consigna lleva {TU} y la respuesta no → "' + consigna + '" / "' + esperadas[0] + '"');
  }
  if (!consignaTU && respuestaTU && ej.tipo === 'traduce') {
    anota(donde, 'la respuesta lleva {TU} y la consigna no → "' + consigna + '" / "' + esperadas[0] + '"');
  }

  // si la respuesta admite contracción, deben valer las dos formas
  if (ej.tipo === 'traduce') {
    const base = String(esperadas[0]).toLowerCase();
    const pares = [[/\bi am\b/, "i'm"], [/\byou are\b/, "you're"], [/\bwhat is\b/, "what's"]];
    for (const [largo, corto] of pares) {
      if (largo.test(base) && !esperadas.some((x) => String(x).toLowerCase().includes(corto))) {
        anota(donde, 'no acepta la forma corta "' + corto + '" → "' + esperadas[0] + '"');
      }
    }
  }
}

for (const u of CURSO) {
  for (const l of (u.lecciones || [])) {
    const d = u.id + ' ' + l.id;
    for (const [c, lista] of [['ej', l.ejercicios], ['entiende', l.entiende], ['practica', l.practica], ['produce', l.produce]]) {
      (lista || []).forEach((ej, i) => revisa(ej, d + ' ' + c + '#' + i));
    }
    if (l.dialogo) l.dialogo.preguntas.forEach((ej, i) => revisa(ej, d + ' pregunta#' + i));
  }
  (u.ejercicios || []).forEach((ej, i) => revisa(ej, u.id + ' ejercicio#' + i));
  (u.examen || []).forEach((ej, i) => revisa(ej, u.id + ' examen#' + i));
}

if (!fallos.length) { console.log('TODAS LAS RESPUESTAS SON ALCANZABLES'); process.exit(0); }
for (const f of fallos) console.log('  ' + f);
console.log('\nTOTAL: ' + fallos.length);
process.exit(1);
