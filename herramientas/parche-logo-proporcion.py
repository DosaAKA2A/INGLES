# -*- coding: utf-8 -*-
# El logo nuevo NO es cuadrado (474.73 x 531.71): si se le fuerza una caja
# cuadrada se deforma. Se dimensiona por altura y el ancho lo pone la propia
# proporcion del SVG.
import io
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------- index.html
p = RAIZ / 'docs' / 'index.html'
s = io.open(p, encoding='utf-8').read()
s = s.replace('src="logo.svg" alt="" width="256" height="256"',
              'src="logo.svg" alt="" width="475" height="532"')
s = s.replace('src="logo.svg" alt="Inglés desde cero" width="256" height="256"',
              'src="logo.svg" alt="Inglés desde cero" width="475" height="532"')
assert 'width="475" height="532"' in s, 'proporcion del logo'
io.open(p, 'w', encoding='utf-8').write(s)
print('index.html: proporcion real del logo')

# ---------------------------------------------------------------- estilo.css
p = RAIZ / 'docs' / 'estilo.css'
s = io.open(p, encoding='utf-8').read()

def rep(viejo, nuevo, donde):
    global s
    assert viejo in s, 'NO ENCONTRADO ' + donde
    s = s.replace(viejo, nuevo)

rep("""  width: 30px; height: 30px; display: block;
  filter: drop-shadow(.12rem .12rem .25rem var(--oscura));""",
    """  height: 30px; width: auto; display: block;
  filter: drop-shadow(.12rem .12rem .25rem var(--oscura));""", 'marca-en')

rep("""  width: 72px; height: 72px;
  /* la sombra sigue el contorno de la forma, no una caja */""",
    """  height: 84px; width: auto;
  /* la sombra sigue el contorno de la forma, no una caja */""", 'intro-logo')

rep("  .intro-logo { width: 62px; height: 62px; }",
    "  .intro-logo { height: 72px; width: auto; }", 'intro-logo movil')

io.open(p, 'w', encoding='utf-8').write(s)
print('estilo.css: logo dimensionado por altura')
