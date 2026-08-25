/* Valida la regla de oro del curso: NADA se pregunta sin haberse enseñado.
   Para las unidades en formato de lecciones, recorre cada lección llevando el
   conjunto acumulado de lo enseñado (vocabulario presentado + `regalos` de las
   explicaciones) y revisa que cada ejercicio — y el examen y el diálogo — solo
   use palabras de ese conjunto o de unidades anteriores.
   Uso: node herramientas/valida-ensenanza.js */

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

// Palabras estructurales que no cuentan como "contenido" (números, nombres
// propios de los ejercicios y signos ya filtrados por la tokenización).
const LIBRES = new Set(['a', 'an', 'the', 'very', 'much', 'oh', 'o']);

const token = (t) => String(t).replace(/\{TU\}/g, 'Alex').toLowerCase().replace(/’/g, "'").replace(/[^a-z' ]+/g, ' ').split(/\s+/).filter(Boolean);

function palabrasDe(frase, bolsa) {
  // primero se comen las frases hechas ya enseñadas (see you later, nice to
  // meet you...), luego se tokeniza lo que queda
  let t = ' ' + token(frase).join(' ') + ' ';
  for (const fija of [...bolsa].filter((x) => x.includes(' ')).sort((a, b) => b.length - a.length)) {
    t = t.split(' ' + fija + ' ').join(' ');
  }
  return t.split(/\s+/).filter(Boolean);
}

// Solo lo que el estudiante debe OIR o PRODUCIR en ingles. Los enunciados y
// las opciones en espanol son instrucciones y no se validan.
function frasesDelEjercicio(ej) {
  const f = [];
  if (ej.tipo === 'escucha' || ej.tipo === 'habla' || ej.tipo === 'ordena') f.push(ej.en);
  if (ej.tipo === 'traduce') f.push(...ej.en);
  if (ej.tipo === 'opcion' && ej.audio) f.push(ej.audio);
  if (ej.di) f.push(ej.di);
  if (ej.tipo === 'huecos') f.push(ej.opciones[ej.r]);
  if (ej.tipo === 'parejas') ej.pares.forEach((p) => f.push(p[0]));
  if (ej.extra) f.push(...ej.extra);
  return f;
}

let fallos = 0;
const acumuladoCurso = new Set(LIBRES);

for (const u of CURSO) {
  if (!u.lecciones) {
    // formato viejo: solo se anota (pendiente de convertir), sumando su vocab
    u.vocab.forEach((v) => token(v.en).forEach((w) => acumuladoCurso.add(w)));
    u.vocab.forEach((v) => { const t = token(v.en).join(' '); if (t.includes(' ')) acumuladoCurso.add(t); });
    console.log(u.id + ': formato viejo (pendiente de convertir), no se valida');
    continue;
  }

  const bolsa = new Set(acumuladoCurso);
  const ensena = (texto) => {
    const t = token(texto).join(' ');
    if (t.includes(' ')) bolsa.add(t);
    token(texto).forEach((w) => bolsa.add(w));
  };

  const revisa = (ej, donde) => {
    for (const frase of frasesDelEjercicio(ej)) {
      const sueltas = palabrasDe(frase, bolsa).filter((w) => !bolsa.has(w));
      if (sueltas.length) {
        console.log(`  FALLO ${u.id} ${donde}: "${frase}" usa sin enseñar: ${sueltas.join(', ')}`);
        fallos++;
      }
    }
  };

  for (const l of u.lecciones) {
    (l.nuevas || []).forEach((i) => { ensena(u.vocab[i].en); if (u.vocab[i].ej) ensena(u.vocab[i].ej); });
    (l.regalos || []).forEach((w) => bolsa.add(w));
    if (l.dialogo) {
      l.dialogo.lineas.forEach((x) => revisa({ tipo: 'escucha', en: x.en }, l.id + ' diálogo'));
      l.dialogo.preguntas.forEach((ej, i) => revisa(ej, l.id + ' pregunta#' + i));
    }
    (l.ejercicios || []).forEach((ej, i) => revisa(ej, l.id + ' ej#' + i));
  }
  u.examen.forEach((ej, i) => revisa(ej, 'examen#' + i));
  bolsa.forEach((w) => acumuladoCurso.add(w));
  console.log(u.id + ': validada (' + u.lecciones.length + ' lecciones)');
}

console.log(fallos ? '\nFALLOS: ' + fallos : '\nTODO ENSEÑADO ANTES DE PREGUNTARSE');
process.exit(fallos ? 1 : 0);
