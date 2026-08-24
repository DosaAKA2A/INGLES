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
const mete = (t, voz) => { t = String(t || '').trim(); if (t) (voz === 'b' ? b : a).add(t); };

const deEjercicio = (ej) => {
  if (ej.tipo === 'escucha' || ej.tipo === 'habla' || ej.tipo === 'ordena') mete(ej.en);
  if (ej.tipo === 'traduce') mete(ej.en[0]);
  if (ej.tipo === 'opcion') { mete(ej.audio); mete(ej.di); }
  if (ej.tipo === 'huecos') mete(ej.di || (ej.antes + ' ' + ej.opciones[ej.r] + ' ' + (ej.despues || '')).trim());
  if (ej.tipo === 'parejas') ej.pares.forEach((p) => mete(p[0]));
};

for (const u of CURSO) {
  u.vocab.forEach((v) => { mete(v.en); mete(v.ej); });
  u.gramatica.forEach((g) => {
    for (const m of g.html.matchAll(/<span class="ej">(.*?)<\/span>/g)) {
      mete(m[1].replace(/<[^>]+>/g, ''));
    }
  });
  if (u.dialogo) {
    u.dialogo.lineas.forEach((l) => mete(l.en, l.q === 'B' ? 'b' : 'a'));
    u.dialogo.preguntas.forEach(deEjercicio);
  }
  u.ejercicios.forEach(deEjercicio);
  u.examen.forEach(deEjercicio);
}
mete('Hello! I am your English tutor. What is your name?');

fs.writeFileSync(path.join(RAIZ, 'frases.json'), JSON.stringify({ a: [...a], b: [...b] }, null, 1));
console.log('voz A:', a.size, '| voz B:', b.size);
const raras = [...a, ...b].filter((t) => /[<>&]/.test(t));
if (raras.length) console.log('OJO, caracteres raros:', raras);
