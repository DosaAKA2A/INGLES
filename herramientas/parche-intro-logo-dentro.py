# -*- coding: utf-8 -*-
# El logo se montaba encima del anillo interior en vez de quedar dentro de él.
# Dos cambios:
#   1. El anillo interior crece y el logo encoge, para que haya borde visible
#      alrededor: el logo queda DENTRO de la cápsula, no pisándola.
#   2. El logo sale de ese hueco: arranca en 0 y no empieza hasta que el anillo
#      interior ya está formado, así parece que emerge del fondo.
import io
from pathlib import Path

p = Path(__file__).resolve().parent.parent / 'docs' / 'estilo.css'
s = io.open(p, encoding='utf-8').read()

viejo = """.intro {
  position: fixed; inset: 0; z-index: 200;
  display: grid; place-items: center;
  background: var(--lienzo);
  transition: opacity .5s ease, transform .5s var(--spring);
}"""
nuevo = """.intro {
  position: fixed; inset: 0; z-index: 200; overflow: hidden;
  display: grid; place-items: center;
  background: var(--lienzo);
  transition: opacity .5s ease, transform .5s var(--spring);
}"""
assert viejo in s, 'intro'
s = s.replace(viejo, nuevo)

viejo = """.intro-anillos span:nth-child(1) { width: 96px;  height: 96px;  animation-delay: .05s; }
.intro-anillos span:nth-child(2) { width: 168px; height: 168px; animation-delay: .17s; }
.intro-anillos span:nth-child(3) { width: 244px; height: 244px; animation-delay: .29s; }
.intro-anillos span:nth-child(4) { width: 324px; height: 324px; animation-delay: .41s; }
.intro-anillos span:nth-child(5) { width: 410px; height: 410px; animation-delay: .53s; }"""
nuevo = """/* El primero es el hueco donde vive el logo: tiene que ser bastante más
   grande que él para que se vea el borde alrededor. */
.intro-anillos span:nth-child(1) { width: 152px; height: 152px; animation-delay: .05s; }
.intro-anillos span:nth-child(2) { width: 236px; height: 236px; animation-delay: .17s; }
.intro-anillos span:nth-child(3) { width: 324px; height: 324px; animation-delay: .29s; }
.intro-anillos span:nth-child(4) { width: 416px; height: 416px; animation-delay: .41s; }
.intro-anillos span:nth-child(5) { width: 512px; height: 512px; animation-delay: .53s; }"""
assert viejo in s, 'anillos'
s = s.replace(viejo, nuevo)

viejo = """.intro-logo {
  position: relative; display: block;
  width: 84px; height: 84px;
  /* la sombra sigue el contorno de la forma, no una caja */
  filter: drop-shadow(.5rem .5rem .9rem var(--oscura)) drop-shadow(-.25rem -.25rem .7rem var(--luz));
  opacity: 0; transform: scale(.55);
  animation: logo-entra .75s cubic-bezier(.22, 1.45, .36, 1) .5s forwards;
}
@keyframes logo-entra {
  from { opacity: 0; transform: scale(.55); }
  to   { opacity: 1; transform: scale(1); }
}"""
nuevo = """.intro-logo {
  position: relative; display: block;
  width: 72px; height: 72px;
  /* la sombra sigue el contorno de la forma, no una caja */
  filter: drop-shadow(.4rem .4rem .8rem var(--oscura)) drop-shadow(-.2rem -.2rem .6rem var(--luz));
  opacity: 0; transform: scale(0);
  /* no arranca hasta que el anillo interior ya está: sale de él */
  animation: logo-entra .7s cubic-bezier(.22, 1.5, .36, 1) .55s forwards;
}
@keyframes logo-entra {
  from { opacity: 0; transform: scale(0); }
  40%  { opacity: 1; }
  to   { opacity: 1; transform: scale(1); }
}"""
assert viejo in s, 'logo'
s = s.replace(viejo, nuevo)

viejo = """@media (max-width: 420px) {
  .intro-anillos span:nth-child(4) { width: 288px; height: 288px; }
  .intro-anillos span:nth-child(5) { width: 356px; height: 356px; }
}"""
nuevo = """@media (max-width: 420px) {
  .intro-logo { width: 62px; height: 62px; }
  .intro-anillos span:nth-child(1) { width: 132px; height: 132px; }
  .intro-anillos span:nth-child(2) { width: 200px; height: 200px; }
  .intro-anillos span:nth-child(3) { width: 268px; height: 268px; }
  .intro-anillos span:nth-child(4) { width: 336px; height: 336px; }
  .intro-anillos span:nth-child(5) { width: 404px; height: 404px; }
}"""
assert viejo in s, 'media movil'
s = s.replace(viejo, nuevo)

io.open(p, 'w', encoding='utf-8').write(s)
print('estilo.css: el logo cabe dentro del anillo interior')
