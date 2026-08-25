// Repara las tres cadenas de worker.js que el heredoc partio con un salto de
// linea real dentro de comillas simples. Ejecutar con node.
const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '..', 'worker', 'worker.js');
let s = fs.readFileSync(p, 'utf8');

const LF = String.fromCharCode(10);
const BARRA_N = String.fromCharCode(92) + 'n'; // backslash + n, sin que ningun shell lo toque

const rotas = [
  "sistema += '" + LF + "Contexto: el estudiante'",
  "sistema += '" + LF + "- El estudiante se llama '",
  "sistema += '" + LF + "- Aprende inglés sobre todo por: '"
];
let n = 0;
for (const rota of rotas) {
  if (s.includes(rota)) {
    s = s.split(rota).join(rota.replace("'" + LF, "'" + BARRA_N));
    n++;
  }
}
fs.writeFileSync(p, s);
console.log('reparadas:', n, 'de', rotas.length);
