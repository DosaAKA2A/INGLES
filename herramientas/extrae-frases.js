/* Extrae todas las frases en inglés FIJAS del curso (las que la página puede
   llegar a decir en voz alta) para pregrabarlas con voz neuronal.
   Salida: frases.json { a: [...], b: [...] } — b es el interlocutor B de los
   diálogos, que habla con otra voz. Uso: node herramientas/extrae-frases.js */

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

const a = new Set(), b = new Set();
// {TU} se pregraba con un nombre neutro; con el nombre real de la persona la
// frase la dice la voz de la nube.
const NEUTRO = 'Alex';

// Una frase con {TU} necesita DOS clips: el del nombre neutro (por si el
// nombre va dentro de la frase) y el de la frase sin el vocativo (que es lo
// que se oye cuando no hay nube). Misma regla que api.alternoDe en voz.js.
const mete = (t, voz) => {
  const crudo = String(t || '').trim();
  if (!crudo) return;
  const conNeutro = crudo.replace(/\{TU\}/g, NEUTRO).trim();
  (voz === 'b' ? b : a).add(conNeutro);
  if (crudo.includes('{TU}')) {
    const sinVocativo = crudo.replace(/,\s*\{TU\}(?=\s*[!?.,]|\s*$)/g, '').trim();
    if (sinVocativo !== crudo) (voz === 'b' ? b : a).add(sinVocativo);
  }
};

const deEjercicio = (ej) => {
  if (ej.tipo === 'escucha' || ej.tipo === 'habla' || ej.tipo === 'ordena') mete(ej.en);
  if (ej.tipo === 'traduce') mete(ej.en[0]);
  if (ej.tipo === 'opcion') { mete(ej.audio); mete(ej.di); }
  // El veredicto de un hueco dice SOLO la palabra correcta (el enunciado suele
  // llevar contexto en espanol). Se pregraban las dos por si acaso.
  if (ej.tipo === 'huecos') { mete(ej.di || ej.opciones[ej.r]); mete(ej.opciones[ej.r]); }
  if (ej.tipo === 'parejas') ej.pares.forEach((p) => mete(p[0]));
};

const deHTML = (html) => {
  for (const m of String(html || '').matchAll(/<span class="ej">(.*?)<\/span>/g)) {
    mete(m[1].replace(/<[^>]+>/g, ''));
  }
};
const deDialogo = (dlg) => {
  dlg.lineas.forEach((l) => mete(l.en, l.q === 'B' ? 'b' : 'a'));
  dlg.preguntas.forEach(deEjercicio);
};
for (const u of CURSO) {
  u.vocab.forEach((v) => {
    mete(v.en); mete(v.ej);
    // el intercambio de la tarjeta: Aria habla (voz a) y el alumno responde (voz b)
    if (v.cambio) { mete(v.cambio.di, 'a'); mete(v.cambio.tu, 'b'); }
  });
  if (u.lecciones) {
    for (const l of u.lecciones) {
      deHTML(l.html);
      if (l.escena) l.escena.lineas.filter((x) => !x.t).forEach((x) => mete(x.en, x.q === 'B' ? 'b' : 'a'));
      if (l.dialogo) deDialogo(l.dialogo);
      (l.ejercicios || []).forEach(deEjercicio);
      (l.entiende || []).forEach(deEjercicio);
      (l.practica || []).forEach(deEjercicio);
      (l.produce || []).forEach(deEjercicio);
    }
  } else {
    u.gramatica.forEach((g) => deHTML(g.html));
    if (u.dialogo) deDialogo(u.dialogo);
    u.ejercicios.forEach(deEjercicio);
  }
  u.examen.forEach(deEjercicio);
}

fs.writeFileSync(path.join(RAIZ, 'frases.json'), JSON.stringify({ a: [...a], b: [...b] }, null, 1));
console.log('voz A:', a.size, '| voz B:', b.size);
const raras = [...a, ...b].filter((t) => /[<>&]/.test(t));
if (raras.length) console.log('OJO, caracteres raros:', raras);
