# -*- coding: utf-8 -*-
# El cuadro "EN" era un marcador. Entra el logo de verdad (docs/logo.svg,
# la forma que dio Dosa) con nuestro degradado: cabecera, intro y favicon.
#
# Va como <img> y no inline a proposito: dos copias inline en la misma pagina
# chocarian por el id del degradado.
import io
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------- index.html
p = RAIZ / 'docs' / 'index.html'
s = io.open(p, encoding='utf-8').read()

viejo = '  <div class="intro-logo">EN</div>'
nuevo = '  <img class="intro-logo" src="logo.svg" alt="" width="256" height="256">'
assert viejo in s, 'logo de la intro'
s = s.replace(viejo, nuevo)

viejo = '    <span class="marca-en">EN</span>'
nuevo = '    <img class="marca-en" src="logo.svg" alt="Inglés desde cero" width="256" height="256">'
assert viejo in s, 'logo de la cabecera'
s = s.replace(viejo, nuevo)

ini = s.index('<link rel="icon"')
fin = s.index('\n', ini)
s = s[:ini] + '<link rel="icon" href="logo.svg" type="image/svg+xml">' + s[fin:]

io.open(p, 'w', encoding='utf-8').write(s)
print('index.html: logo en cabecera, intro y favicon')

# ---------------------------------------------------------------- estilo.css
p = RAIZ / 'docs' / 'estilo.css'
s = io.open(p, encoding='utf-8').read()

viejo = """.marca-en {
  display: grid; place-items: center;
  width: 34px; height: 34px; border-radius: 12px;
  background: var(--grad); color: #fff;
  font-weight: 900; font-size: 12.5px;
}"""
nuevo = """.marca-en {
  width: 30px; height: 30px; display: block;
  filter: drop-shadow(.12rem .12rem .25rem var(--oscura));
  transition: transform var(--dur) var(--spring-fuerte);
}
.marca:hover .marca-en { transform: rotate(-8deg) scale(1.06); }"""
assert viejo in s, 'marca-en'
s = s.replace(viejo, nuevo)

viejo = """.intro-logo {
  position: relative; display: grid; place-items: center;
  width: 76px; height: 76px; border-radius: 24px;
  background: var(--grad); color: #fff;
  font-weight: 900; font-size: 26px; letter-spacing: .02em;
  box-shadow: .6rem .6rem 1.2rem var(--oscura), -.3rem -.3rem 1rem var(--luz);
  opacity: 0; transform: scale(.55);
  animation: logo-entra .75s cubic-bezier(.22, 1.45, .36, 1) .5s forwards;
}"""
nuevo = """.intro-logo {
  position: relative; display: block;
  width: 84px; height: 84px;
  /* la sombra sigue el contorno de la forma, no una caja */
  filter: drop-shadow(.5rem .5rem .9rem var(--oscura)) drop-shadow(-.25rem -.25rem .7rem var(--luz));
  opacity: 0; transform: scale(.55);
  animation: logo-entra .75s cubic-bezier(.22, 1.45, .36, 1) .5s forwards;
}"""
assert viejo in s, 'intro-logo'
s = s.replace(viejo, nuevo)

io.open(p, 'w', encoding='utf-8').write(s)
print('estilo.css: logo en vez del cuadro EN')
