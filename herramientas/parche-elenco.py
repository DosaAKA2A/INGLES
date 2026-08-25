# -*- coding: utf-8 -*-
# El elenco de verdad: los 12 avatares que dio Dosa (Pictures/PJs).
#
# Aria es la unica con nombre fijo; el resto es un banco del que se tira SEGUN
# EL GENERO del papel. Y el genero manda la voz: mujer -> voz A (Aria neural),
# hombre -> voz B (Andrew neural). Asi, al escribir una escena nueva basta con
# decir quien la interpreta y todo lo demas (cara y voz) sale solo.
#
# Van como <img>: los 12 archivos salen de Illustrator y TODOS numeran sus
# clases igual (.cls-1, .cls-2...). En linea se pisarian el color unos a otros;
# como imagen, cada uno es su propio documento y no se tocan.
import io
import shutil
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = Path('C:/Users/Dosa/Pictures/PJs')
DESTINO = RAIZ / 'docs' / 'personajes'

DESTINO.mkdir(parents=True, exist_ok=True)
copiados = 0
for f in sorted(ORIGEN.glob('*.svg')):
    shutil.copyfile(f, DESTINO / f.name)
    copiados += 1
print('personajes copiados: %d' % copiados)

def parchea(nombre, cambios):
    p = RAIZ / nombre
    s = io.open(p, encoding='utf-8').read()
    for viejo, nuevo in cambios:
        assert viejo in s, 'NO ENCONTRADO en ' + nombre + ': ' + viejo[:90]
        s = s.replace(viejo, nuevo)
    io.open(p, 'w', encoding='utf-8').write(s)
    print(nombre + ': parcheado')

parchea('docs/app.js', [
("""// Los dos personajes del curso. Cada uno tiene SU voz: la misma persona suena
// siempre igual, en las escenas, en los dialogos y en las tarjetas.
const PERSONAJES = {
  A: { nombre: 'Aria', voz: 'a', avatar: 'personajes/aria.png' },
  B: { nombre: 'Andrew', voz: 'b', avatar: 'personajes/andrew.png' }
};
function personaje(q) { return PERSONAJES[q] || { nombre: String(q), voz: 'a', avatar: '' }; }""",
 """// ---- elenco -----------------------------------------------------------------
// Los 12 avatares del curso. Aria es la unica con nombre fijo; los demas son
// un banco del que se tira segun el GENERO del papel. El genero manda la voz:
// mujer -> voz A, hombre -> voz B. Al escribir una escena solo hay que decir
// quien la interpreta: cara y voz salen solas.
const ELENCO = {
  aria: 'f', pj3: 'f', pj5: 'f', pj6: 'f', pj10: 'f',
  pj1: 'm', pj2: 'm', pj4: 'm', pj7: 'm', pj8: 'm', pj9: 'm', pj11: 'm'
};

// Quien interpreta cada nombre que aparece en los dialogos.
const REPARTO = {
  Aria: 'aria',
  Andrew: 'pj2'
};

// Una escena reparte sus dos huecos de voz: A = voz femenina, B = masculina.
const REPARTO_POR_DEFECTO = { A: 'Aria', B: 'Andrew' };
let repartoActual = REPARTO_POR_DEFECTO;
function reparte(r) { repartoActual = Object.assign({}, REPARTO_POR_DEFECTO, r || {}); }

function personaje(q) {
  // `q` es el hueco de voz ('A'/'B') o directamente el nombre del personaje
  const nombre = repartoActual[q] || q;
  const pj = REPARTO[nombre];
  const genero = ELENCO[pj];
  return {
    nombre: String(nombre),
    voz: genero === 'm' ? 'b' : 'a',
    avatar: pj ? 'personajes/' + pj + '.svg' : ''
  };
}""" ),
])

parchea('docs/lecciones.js', [
# la escena reparte sus papeles antes de pintar
("""function vEscena(unidad, idx) {
  const l = unidad.lecciones[idx];
  const e = l.escena;""",
 """function vEscena(unidad, idx) {
  const l = unidad.lecciones[idx];
  const e = l.escena;
  reparte(e.reparto);""" ),
# el dialogo final, igual
("""function vLeccionDialogo(unidad, idx) {
  const l = unidad.lecciones[idx];
  const dlg = l.dialogo;""",
 """function vLeccionDialogo(unidad, idx) {
  const l = unidad.lecciones[idx];
  const dlg = l.dialogo;
  reparte(dlg.reparto);""" ),
# la voz de cada linea sale del personaje, no del hueco
("""      Voz.di(x.en, { lento: AJ.lento, voz: x.q === 'B' ? 'b' : 'a', alTerminar: () => g.classList.remove('sonando') });
    });
  });

  let tocando = false;
  $('#reproducir').addEventListener('click', () => {
    if (tocando) { tocando = false; Voz.calla(); return; }
    tocando = true;
    const globos = [...vista().querySelectorAll('.globo')];""",
 """      Voz.di(x.en, { lento: AJ.lento, voz: personaje(x.q).voz, alTerminar: () => g.classList.remove('sonando') });
    });
  });

  let tocando = false;
  $('#reproducir').addEventListener('click', () => {
    if (tocando) { tocando = false; Voz.calla(); return; }
    tocando = true;
    const globos = [...vista().querySelectorAll('.globo')];""" ),
("""      Voz.di(x.en, { lento: AJ.lento, voz: x.q === 'B' ? 'b' : 'a', alTerminar: () => setTimeout(() => toca(n + 1), 350) });""",
 """      Voz.di(x.en, { lento: AJ.lento, voz: personaje(x.q).voz, alTerminar: () => setTimeout(() => toca(n + 1), 350) });""" ),
("""      Voz.di(x.en, { lento: AJ.lento, voz: x.q === 'B' ? 'b' : 'a', alTerminar: () => g.classList.remove('sonando') });""",
 """      Voz.di(x.en, { lento: AJ.lento, voz: personaje(x.q).voz, alTerminar: () => g.classList.remove('sonando') });""" ),
("""      Voz.di(x.en, { lento: AJ.lento, voz: x.q === 'B' ? 'b' : 'a', alTerminar: () => setTimeout(() => toca(i + 1), 350) });""",
 """      Voz.di(x.en, { lento: AJ.lento, voz: personaje(x.q).voz, alTerminar: () => setTimeout(() => toca(i + 1), 350) });""" ),
# la tarjeta la protagoniza Aria siempre
("""function cambioDe(v) {
  if (!v.cambio) return v.ej ? `<p class="carta-ej">${esc(v.ej)} ${botonAudio(v.ej)}</p>` : '';
  const p = personaje('A');""",
 """function cambioDe(v) {
  if (!v.cambio) return v.ej ? `<p class="carta-ej">${esc(v.ej)} ${botonAudio(v.ej)}</p>` : '';
  reparte(null);                       // en la tarjeta habla siempre Aria
  const p = personaje('A');""" ),
])

# la cara ya no lleva inicial cuando hay avatar de verdad
p = RAIZ / 'docs' / 'estilo.css'
s = io.open(p, encoding='utf-8').read()
s = s.replace(""".cara img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }""",
              """/* Los avatares son bustos verticales (162x224): recortados en circulo hay que
   anclarlos ARRIBA o se ve el pecho en vez de la cara. */
.cara img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 4%; }""")
s += """
.cara { background: var(--oscura); }        /* fondo tras el avatar recortado */
.cara-tu { background: var(--lienzo); }
"""
io.open(p, 'w', encoding='utf-8').write(s)
print('estilo.css: encuadre de los avatares')
