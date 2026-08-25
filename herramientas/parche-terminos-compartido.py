# -*- coding: utf-8 -*-
# `terminos()` se muda de app.js a datos.js para que la auditoria use LA MISMA
# funcion que la pantalla. Antes el linter miraba el dato crudo y la app lo
# arreglaba al pintar: el informe no se parecia a lo que se ve.
#
# De paso entran por la funcion la descripcion de la unidad y la consigna del
# ensayo, que se habian quedado fuera.
import io
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# ---- 1. sacar el bloque de app.js ----
p = RAIZ / 'docs' / 'app.js'
s = io.open(p, encoding='utf-8').read()
ini = s.index('// ---- terminos en ingles dentro de texto en espanol')
fin = s.index('function mayus(t) {')
bloque = s[ini:fin]
s = s[:ini] + s[fin:]
io.open(p, 'w', encoding='utf-8').write(s)
print('app.js: bloque extraido')

# ---- 2. meterlo en datos.js, detras de la declaracion de CURSO ----
p = RAIZ / 'docs' / 'datos.js'
d = io.open(p, encoding='utf-8').read()
ancla = 'const CURSO = [];\n'
assert ancla in d
d = d.replace(ancla, ancla + '\n' + bloque.rstrip() + '\n', 1)
io.open(p, 'w', encoding='utf-8').write(d)
print('datos.js: terminos() compartido con las herramientas')

# ---- 3. los dos campos que faltaban ----
p = RAIZ / 'docs' / 'app.js'
s = io.open(p, encoding='utf-8').read()
n = 0
for viejo, nuevo in [
    ("esc(unidad.descripcion)", "esc(terminos(unidad.descripcion))"),
    ("esc(u.descripcion)", "esc(terminos(u.descripcion))"),
    ("esc(e.consigna)", "esc(terminos(e.consigna))"),
]:
    if viejo in s:
        s = s.replace(viejo, nuevo)
        n += 1
io.open(p, 'w', encoding='utf-8').write(s)
print('app.js: %d campos mas por terminos()' % n)

p = RAIZ / 'docs' / 'lecciones.js'
s = io.open(p, encoding='utf-8').read()
if "esc(unidad.descripcion)" in s:
    s = s.replace("esc(unidad.descripcion)", "esc(terminos(unidad.descripcion))")
    io.open(p, 'w', encoding='utf-8').write(s)
    print('lecciones.js: descripcion por terminos()')

# ---- 4. la auditoria llama a la funcion de verdad ----
p = RAIZ / 'herramientas' / 'audita-mayusculas.js'
s = io.open(p, encoding='utf-8').read()

s = s.replace("""const CURSO = vm.runInContext('CURSO', ctx);""",
              """const CURSO = vm.runInContext('CURSO', ctx);
// LA MISMA funcion que usa la pantalla (vive en docs/datos.js): asi el informe
// dice lo que de verdad se ve, no lo que hay escrito en el dato.
const terminos = vm.runInContext('terminos', ctx);""")

s = s.replace("""  const plano = String(texto).replace(/<[^>]+>/g, '');
  if (!MARCA_ES.test(plano)) return;              // texto en ingles: no se toca""",
              """  // se audita el texto YA PINTADO
  const plano = terminos(String(texto)).replace(/<[^>]+>/g, '');
  if (!MARCA_ES.test(plano)) return;              // texto en ingles: no se toca""")

io.open(p, 'w', encoding='utf-8').write(s)
print('audita-mayusculas.js: audita el texto pintado')
