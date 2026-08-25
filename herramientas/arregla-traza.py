# Repara la linea de traza que el heredoc corrompio (metio un salto de linea
# real dentro del regex) y la deja como debia ser.
import io
import re
from pathlib import Path

p = Path(__file__).resolve().parent.parent / 'worker' / 'worker.js'
s = io.open(p, encoding='utf-8').read()

# La linea rota: traza.push('txt:' + ev.data.slice(0, 60).replace(/[<CR o LF reales>]+/g, ' '));
rota = re.compile(r"traza\.push\('txt:' \+ ev\.data\.slice\(0, 60\)\.replace\(/\[[\r\n]+\]\+/g, ' '\)\);")
buena = r"traza.push('txt:' + ev.data.slice(0, 60).replace(/[\r\n]+/g, ' '));"
s2, n = rota.subn(buena.replace('\\', '\\\\'), s)
# subn con replace de backslashes: en el reemplazo de re, \\ -> \
assert n == 1, 'no encontre la linea rota (' + str(n) + ')'
io.open(p, 'w', encoding='utf-8').write(s2)
print('reparado')
