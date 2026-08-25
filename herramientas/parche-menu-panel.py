# -*- coding: utf-8 -*-
# El botón de menú tiene que verse mientras el menú está abierto: si no, la X
# no sirve para nada. Los ajustes dejan de ser un modal a pantalla completa
# (que emborronaba la barra) y pasan a ser un panel que sale de detrás de la
# barra, anclado al botón. La barra queda por encima del velo.
import io
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------- estilo.css
p = RAIZ / 'docs' / 'estilo.css'
s = io.open(p, encoding='utf-8').read()

s += """

/* ---- menú (sale de detrás de la barra, anclado al botón) --------------- */
#menu-velo {
  position: fixed; inset: 0; z-index: 25;
  background: rgba(45, 55, 82, .28);
  opacity: 0; transition: opacity .28s ease;
}
#menu-velo.entra { opacity: 1; }

#menu-panel {
  position: fixed; z-index: 29;
  width: min(340px, calc(100vw - var(--gut) * 2));
  background: var(--lienzo); border-radius: 1.4rem; padding: 8px 22px 20px;
  box-shadow: var(--relieve-grande);
  transform-origin: top right;
  transform: translateY(-14px) scale(.94); opacity: 0;
  transition: transform .38s var(--spring-fuerte), opacity .22s ease;
  max-height: calc(100vh - 100px); overflow-y: auto;
}
#menu-panel.entra { transform: none; opacity: 1; }
#menu-panel h2 { margin: 12px 0 4px; font-size: 17px; }
#menu-panel .fila {
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
  padding: 14px 0;
}
#menu-panel .fila + .fila { border-top: 2px solid rgba(200, 208, 231, .45); }
#menu-panel .btn { padding: 8px 14px; }
"""
io.open(p, 'w', encoding='utf-8').write(s)
print('estilo.css: panel de menu')

# ---------------------------------------------------------------- app.js
p = RAIZ / 'docs' / 'app.js'
s = io.open(p, encoding='utf-8').read()

viejo = """const btnMenu = $('#btn-menu');
btnMenu.addEventListener('click', () => {
  // el mismo botón abre y cierra: por eso se pliega en X al abrirse
  if (btnMenu.classList.contains('abierto')) { cierraModal(); return; }
  btnMenu.classList.add('abierto');
  btnMenu.setAttribute('aria-expanded', 'true');
  const capa = modal(`"""
nuevo = """const btnMenu = $('#btn-menu');

// El panel se ancla al botón y la barra queda por encima del velo, para que la
// X siga a la vista y sirva para cerrar.
function abrePanel(html) {
  cierraPanel(true);
  const velo = document.createElement('div');
  velo.id = 'menu-velo';
  const panel = document.createElement('div');
  panel.id = 'menu-panel';
  panel.innerHTML = html;
  document.body.append(velo, panel);
  const b = $('.barra').getBoundingClientRect();
  panel.style.top = (b.bottom + 10) + 'px';
  panel.style.right = Math.max(8, window.innerWidth - b.right) + 'px';
  requestAnimationFrame(() => { velo.classList.add('entra'); panel.classList.add('entra'); });
  velo.addEventListener('pointerdown', () => cierraPanel());
  btnMenu.classList.add('abierto');
  btnMenu.setAttribute('aria-expanded', 'true');
  return panel;
}
function cierraPanel(deGolpe) {
  btnMenu.classList.remove('abierto');
  btnMenu.setAttribute('aria-expanded', 'false');
  for (const id of ['menu-velo', 'menu-panel']) {
    const n = document.getElementById(id);
    if (!n) continue;
    if (deGolpe) { n.remove(); continue; }
    n.classList.remove('entra');
    setTimeout(() => n.remove(), 300);
  }
}
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') cierraPanel(); });

btnMenu.addEventListener('click', () => {
  // el mismo botón abre y cierra: por eso se pliega en X al abrirse
  if (btnMenu.classList.contains('abierto')) { cierraPanel(); return; }
  const capa = abrePanel(`"""
assert viejo in s, 'wiring del boton'
s = s.replace(viejo, nuevo)

# dentro del panel, cerrar es cerrar el panel (no el modal)
viejo = """    <div class="espacio"></div>
    <button class="btn ancho" id="aj-cerrar">Cerrar</button>`);
  capa.querySelector('#aj-lento').addEventListener('change', (e) => {"""
nuevo = """    <div class="espacio"></div>
    <button class="btn ancho" id="aj-cerrar">Cerrar</button>`);
  capa.querySelector('#aj-lento').addEventListener('change', (e) => {"""
assert viejo in s
# reemplazos puntuales solo dentro del bloque del menú
ini = s.index('btnMenu.addEventListener')
fin = s.index('function modalPase(')
bloque = s[ini:fin]
bloque = bloque.replace('cierraModal();', 'cierraPanel();')
bloque = bloque.replace("capa.querySelector('#aj-cerrar').addEventListener('click', cierraModal);",
                        "capa.querySelector('#aj-cerrar').addEventListener('click', () => cierraPanel());")
bloque = bloque.replace("cierraModal(); vInicio();", "cierraPanel(); vInicio();")
bloque = bloque.replace("cierraModal(); vOnboarding();", "cierraPanel(); vOnboarding();")
s = s[:ini] + bloque + s[fin:]

# cierraModal ya no toca el botón (lo hace cierraPanel)
viejo = """function cierraModal() {
  $('#capa-modal').classList.add('oculto');
  $('#capa-modal').innerHTML = '';
  const b = $('#btn-menu');
  if (b) { b.classList.remove('abierto'); b.setAttribute('aria-expanded', 'false'); }
}"""
nuevo = """function cierraModal() { $('#capa-modal').classList.add('oculto'); $('#capa-modal').innerHTML = ''; }"""
assert viejo in s
s = s.replace(viejo, nuevo)

io.open(p, 'w', encoding='utf-8').write(s)
print('app.js: panel anclado en vez de modal')
