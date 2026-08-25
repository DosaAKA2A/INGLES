# -*- coding: utf-8 -*-
# Dos piezas nuevas pedidas por Dosa (referencias de CodePen, adaptadas a
# nuestros colores y sin dependencias externas):
#
# 1. Boton de menu neumorfico (ref. sebastian-piskaty/dyPWwLL): tres barras que
#    al abrirse se juntan en una X mientras el boton se hunde. En el pen las
#    barras eran lightcoral; aqui llevan nuestro degradado cian.
#
# 2. Intro de la app (ref. shunyadezain/xxZpxKQ): anillos hundidos que salen
#    del centro en cadena y detras aparece el logo. El pen usaba GSAP; aqui va
#    en CSS puro porque la app tiene que funcionar sin conexion. El logo es el
#    marcador "EN" de ahora: cuando haya logo de verdad, se cambia ese nodo.
import io
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------- index.html
p = RAIZ / 'docs' / 'index.html'
s = io.open(p, encoding='utf-8').read()

viejo = '    <button class="boton-icono" id="btn-ajustes" title="Ajustes" aria-label="Ajustes"></button>'
nuevo = ('    <button class="btn-menu" id="btn-menu" title="Menú" aria-label="Menú" aria-expanded="false">'
         '<i></i><i></i><i></i></button>')
assert viejo in s, 'boton de ajustes'
s = s.replace(viejo, nuevo)

viejo = '<body>\n'
nuevo = """<body>

<!-- Intro: se quita sola al terminar (o al primer toque). El primer toque
     ademas desbloquea el audio del navegador. -->
<div id="intro" class="intro" aria-hidden="true">
  <div class="intro-anillos"><span></span><span></span><span></span><span></span><span></span></div>
  <div class="intro-logo">EN</div>
  <p class="intro-nombre">Inglés desde cero</p>
</div>

"""
assert viejo in s
s = s.replace(viejo, nuevo, 1)

io.open(p, 'w', encoding='utf-8').write(s)
print('index.html: boton de menu + intro')

# ---------------------------------------------------------------- estilo.css
p = RAIZ / 'docs' / 'estilo.css'
s = io.open(p, encoding='utf-8').read()

viejo = """.boton-icono {
  display: grid; place-items: center;
  width: 36px; height: 36px; border-radius: var(--r-chip);
  box-shadow: var(--relieve);
  transition: box-shadow var(--dur) ease, transform var(--dur) var(--spring);
}"""
nuevo = """.boton-icono {
  display: grid; place-items: center;
  width: 36px; height: 36px; border-radius: var(--r-chip);
  box-shadow: var(--relieve);
  transition: box-shadow var(--dur) ease, transform var(--dur) var(--spring);
}

/* Botón de menú: tres barras que se pliegan en X y el botón se hunde. */
.btn-menu {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: var(--r-chip);
  background: var(--lienzo); cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  box-shadow: var(--relieve);
  transition: box-shadow .5s cubic-bezier(.79, .21, .06, .81), transform var(--dur) var(--spring);
}
.btn-menu i {
  display: block; width: 17px; height: 2.5px; border-radius: 3px; margin: 2.5px 0;
  background: var(--grad);
  box-shadow: 0 0 8px rgba(33, 163, 232, .38);
  transition: margin .4s cubic-bezier(.79, .21, .06, .81), transform .4s cubic-bezier(.79, .21, .06, .81);
}
.btn-menu:hover { transform: translateY(-2px); }
.btn-menu:active { transform: scale(.94); }
.btn-menu.abierto { box-shadow: var(--hundido); transform: none; }
.btn-menu.abierto i { margin: -1.25px; }
.btn-menu.abierto i:nth-child(1) { transform: rotate(-45deg); }
.btn-menu.abierto i:nth-child(2) { transform: scale(0); }
.btn-menu.abierto i:nth-child(3) { transform: rotate(45deg); }"""
assert viejo in s, 'boton-icono'
s = s.replace(viejo, nuevo)

s += """

/* ---- intro ------------------------------------------------------------- */
/* Anillos hundidos que salen del centro en cadena; detrás aparece el logo.
   Se quita sola: no hay nada que pulsar para pasar de aquí. */
.intro {
  position: fixed; inset: 0; z-index: 200;
  display: grid; place-items: center;
  background: var(--lienzo);
  transition: opacity .5s ease, transform .5s var(--spring);
}
.intro.fuera { opacity: 0; transform: scale(1.06); pointer-events: none; }

.intro-anillos { position: absolute; display: grid; place-items: center; }
.intro-anillos span {
  position: absolute; border-radius: 50%;
  box-shadow: inset .5rem .5rem 1rem var(--oscura), inset -.5rem -.5rem 1rem var(--luz);
  transform: scale(0);
  animation: anillo-sale .95s cubic-bezier(.22, 1.5, .36, 1) forwards;
}
.intro-anillos span:nth-child(1) { width: 96px;  height: 96px;  animation-delay: .05s; }
.intro-anillos span:nth-child(2) { width: 168px; height: 168px; animation-delay: .17s; }
.intro-anillos span:nth-child(3) { width: 244px; height: 244px; animation-delay: .29s; }
.intro-anillos span:nth-child(4) { width: 324px; height: 324px; animation-delay: .41s; }
.intro-anillos span:nth-child(5) { width: 410px; height: 410px; animation-delay: .53s; }
@keyframes anillo-sale { from { transform: scale(0); } to { transform: scale(1); } }

.intro-logo {
  position: relative; display: grid; place-items: center;
  width: 76px; height: 76px; border-radius: 24px;
  background: var(--grad); color: #fff;
  font-weight: 900; font-size: 26px; letter-spacing: .02em;
  box-shadow: .6rem .6rem 1.2rem var(--oscura), -.3rem -.3rem 1rem var(--luz);
  opacity: 0; transform: scale(.55);
  animation: logo-entra .75s cubic-bezier(.22, 1.45, .36, 1) .5s forwards;
}
@keyframes logo-entra {
  from { opacity: 0; transform: scale(.55); }
  to   { opacity: 1; transform: scale(1); }
}

.intro-nombre {
  position: absolute; bottom: 18%;
  font-weight: 800; font-size: 14px; letter-spacing: .16em; text-transform: uppercase;
  color: var(--tinta-3);
  opacity: 0; animation: nombre-entra .6s ease .9s forwards;
}
@keyframes nombre-entra { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

@media (max-width: 420px) {
  .intro-anillos span:nth-child(4) { width: 288px; height: 288px; }
  .intro-anillos span:nth-child(5) { width: 356px; height: 356px; }
}

/* Quien pide menos movimiento ve el logo directamente, sin cadena de anillos. */
@media (prefers-reduced-motion: reduce) {
  .intro-anillos span { animation-duration: .01s; animation-delay: 0s; }
  .intro-logo, .intro-nombre { animation-duration: .2s; animation-delay: 0s; }
}
"""

io.open(p, 'w', encoding='utf-8').write(s)
print('estilo.css: boton de menu + intro')

# ---------------------------------------------------------------- app.js
p = RAIZ / 'docs' / 'app.js'
s = io.open(p, encoding='utf-8').read()

viejo = """function cierraModal() { $('#capa-modal').classList.add('oculto'); $('#capa-modal').innerHTML = ''; }

$('#btn-ajustes').innerHTML = ICO.ajustes;
$('#btn-ajustes').addEventListener('click', () => {
  const capa = modal(`"""
nuevo = """function cierraModal() {
  $('#capa-modal').classList.add('oculto');
  $('#capa-modal').innerHTML = '';
  const b = $('#btn-menu');
  if (b) { b.classList.remove('abierto'); b.setAttribute('aria-expanded', 'false'); }
}

const btnMenu = $('#btn-menu');
btnMenu.addEventListener('click', () => {
  // el mismo botón abre y cierra: por eso se pliega en X al abrirse
  if (btnMenu.classList.contains('abierto')) { cierraModal(); return; }
  btnMenu.classList.add('abierto');
  btnMenu.setAttribute('aria-expanded', 'true');
  const capa = modal(`"""
assert viejo in s, 'wiring del boton'
s = s.replace(viejo, nuevo)

# la intro se retira sola
s += """

// ---- intro ------------------------------------------------------------------
// La cortina se retira sola cuando termina la cadena de anillos; un toque la
// adelanta (y de paso desbloquea el audio del navegador).
(() => {
  const intro = $('#intro');
  if (!intro) return;
  let ido = false;
  const quita = () => {
    if (ido) return;
    ido = true;
    intro.classList.add('fuera');
    setTimeout(() => intro.remove(), 550);
  };
  intro.addEventListener('pointerdown', quita);
  setTimeout(quita, 1900);
})();
"""

io.open(p, 'w', encoding='utf-8').write(s)
print('app.js: menu conmutable + retirada de la intro')
