# -*- coding: utf-8 -*-
# Personajes y tarjeta-intercambio (peticion de Dosa 2026-08-25).
#
# 1. PERSONAJES. Las letras A y B se sustituyen por personas con nombre, cara y
#    voz propia. Los nombres salen de las voces que ya usa el curso:
#    Aria (en-US-AriaNeural) y Andrew (en-US-AndrewNeural). Mientras no haya
#    avatar, cae a la inicial: la maquinaria no depende de las imagenes.
#
# 2. LA TARJETA DE PALABRA NUEVA DEJA DE REPETIRSE. Antes tenia dos botones de
#    audio para casi la misma frase ("See you later" y "See you later!"). Ahora
#    el ejemplo es un INTERCAMBIO: Aria te habla a TI (con tu nombre) y debajo
#    va la respuesta que darias tu. Se declara con `cambio: {di, tu}` en el
#    vocabulario; si una palabra no lo trae, se sigue usando `ej`.
import io
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

def parchea(nombre, cambios):
    p = RAIZ / nombre
    s = io.open(p, encoding='utf-8').read()
    for viejo, nuevo in cambios:
        assert viejo in s, 'NO ENCONTRADO en ' + nombre + ': ' + viejo[:90]
        s = s.replace(viejo, nuevo)
    io.open(p, 'w', encoding='utf-8').write(s)
    print(nombre + ': parcheado')

# ---------------------------------------------------------------- app.js
parchea('docs/app.js', [
("""function mayus(t) {""",
 """// Los dos personajes del curso. Cada uno tiene SU voz: la misma persona suena
// siempre igual, en las escenas, en los dialogos y en las tarjetas.
const PERSONAJES = {
  A: { nombre: 'Aria', voz: 'a', avatar: 'personajes/aria.png' },
  B: { nombre: 'Andrew', voz: 'b', avatar: 'personajes/andrew.png' }
};
function personaje(q) { return PERSONAJES[q] || { nombre: String(q), voz: 'a', avatar: '' }; }

// Cara del personaje. Si aun no hay imagen, la inicial: nada se rompe por
// faltar un archivo.
function caraDe(q) {
  const p = personaje(q);
  const inicial = p.nombre.charAt(0).toUpperCase();
  return `<span class="cara cara-${esc(q)}" title="${esc(p.nombre)}">`
    + (p.avatar ? `<img src="${esc(p.avatar)}" alt="${esc(p.nombre)}" onerror="this.remove()">` : '')
    + `<b>${esc(inicial)}</b></span>`;
}

// La cara del alumno: su inicial, sin imagen.
function caraTuya() {
  return `<span class="cara cara-tu" title="${esc(tuNombre())}"><b>${esc(tuNombre().charAt(0).toUpperCase())}</b></span>`;
}

function mayus(t) {""" ),
])

# ---------------------------------------------------------------- lecciones.js
parchea('docs/lecciones.js', [

# escenas: cara y nombre en vez de la letra
("""    filas += `<div class="linea ${x.q === 'B' ? 'b' : ''}">
      <span class="linea-quien">${esc(x.q)}</span>
      <div class="globo" data-idx="${i}">${esc(x.en)}<span class="globo-es">${esc(x.es)}</span></div>
    </div>`;
  });
  vista().innerHTML = `
    <button class="volver" id="salir">${ICO.atras} ${esc(unidad.titulo)}</button>""",
 """    filas += `<div class="linea ${x.q === 'B' ? 'b' : ''}">
      ${caraDe(x.q)}
      <div class="globo" data-idx="${i}"><span class="globo-quien">${esc(personaje(x.q).nombre)}</span>${esc(x.en)}<span class="globo-es">${esc(x.es)}</span></div>
    </div>`;
  });
  vista().innerHTML = `
    <button class="volver" id="salir">${ICO.atras} ${esc(unidad.titulo)}</button>""" ),

# dialogo final: igual
("""    lineas += `<div class="linea ${x.q === 'B' ? 'b' : ''}">
      <span class="linea-quien">${esc(x.q)}</span>
      <div class="globo" data-idx="${i}">${esc(x.en)}<span class="globo-es">${esc(x.es)}</span></div>
    </div>`;""",
 """    lineas += `<div class="linea ${x.q === 'B' ? 'b' : ''}">
      ${caraDe(x.q)}
      <div class="globo" data-idx="${i}"><span class="globo-quien">${esc(personaje(x.q).nombre)}</span>${esc(x.en)}<span class="globo-es">${esc(x.es)}</span></div>
    </div>`;""" ),

# la tarjeta: intercambio en vez de ejemplo repetido
("""      ${v.uso ? `<p class="carta-uso">${conNombre(v.uso)}</p>` : ''}
      ${v.nota ? `<p class="carta-nota">${conNombre(v.nota)}</p>` : ''}
      ${v.ej ? `<p class="carta-ej">${esc(v.ej)} ${botonAudio(v.ej)}</p>` : ''}
    </div>""",
 """      ${v.uso ? `<p class="carta-uso">${conNombre(v.uso)}</p>` : ''}
      ${v.nota ? `<p class="carta-nota">${conNombre(v.nota)}</p>` : ''}
      ${cambioDe(v)}
    </div>""" ),

("""// Fase "Aprende": una tarjeta por palabra nueva, con imagen, audio y ejemplo.""",
 """// El ejemplo de una palabra es un INTERCAMBIO: Aria te habla a ti y debajo va
// lo que responderias tu. Antes era una frase suelta con su propio boton de
// audio, casi identica al titular de la tarjeta: dos botones para lo mismo.
function cambioDe(v) {
  if (!v.cambio) return v.ej ? `<p class="carta-ej">${esc(v.ej)} ${botonAudio(v.ej)}</p>` : '';
  const p = personaje('A');
  return `<div class="cambio">
    <div class="cambio-linea">
      ${caraDe('A')}
      <div class="cambio-globo">
        <span class="cambio-quien">${esc(p.nombre)}</span>
        ${esc(v.cambio.di)} ${botonAudio(v.cambio.di)}
      </div>
    </div>
    <div class="cambio-linea tu">
      ${caraTuya()}
      <div class="cambio-globo">
        <span class="cambio-quien">Tú</span>
        ${esc(v.cambio.tu)} ${botonAudio(v.cambio.tu, 'voz-b')}
      </div>
    </div>
  </div>`;
}

// Fase "Aprende": una tarjeta por palabra nueva, con imagen, audio y ejemplo.""" ),

# al entrar en la tarjeta, que suene el titular y no el intercambio entero
("""  Voz.di(v.en, { lento: AJ.lento });
  $('#salir').addEventListener('click', () => { Voz.calla(); vUnidad(unidad.id); });""",
 """  Voz.di(v.en, { lento: AJ.lento });
  // la linea del alumno suena con la otra voz: en un intercambio, dos personas
  vista().querySelectorAll('.btn-audio.voz-b').forEach((b) => {
    b.addEventListener('click', (e) => { e.stopPropagation(); Voz.di(b.dataset.di, { lento: AJ.lento, voz: 'b' }); }, true);
  });
  $('#salir').addEventListener('click', () => { Voz.calla(); vUnidad(unidad.id); });""" ),
])

# ---------------------------------------------------------------- estilo.css
p = RAIZ / 'docs' / 'estilo.css'
s = io.open(p, encoding='utf-8').read()
s += """

/* ---- personajes -------------------------------------------------------- */
.cara {
  flex: none; position: relative; overflow: hidden;
  display: grid; place-items: center;
  width: 38px; height: 38px; border-radius: 50%;
  background: var(--lienzo); box-shadow: var(--relieve);
  font-weight: 900; font-size: 14px; color: var(--tinta-2);
}
.cara img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.cara img + b { display: none; }              /* con foto, fuera la inicial */
.cara-B { color: var(--a-texto); }
.cara-tu { box-shadow: var(--hundido-suave); color: var(--tinta-3); }

.globo-quien, .cambio-quien {
  display: block; margin-bottom: 3px;
  font-weight: 800; font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase;
  color: var(--tinta-3);
}

/* ---- intercambio de la tarjeta ---------------------------------------- */
.cambio { margin-top: 18px; display: flex; flex-direction: column; gap: 10px; text-align: left; }
.cambio-linea { display: flex; align-items: flex-start; gap: 10px; }
.cambio-linea.tu { flex-direction: row-reverse; }
.cambio-globo {
  flex: 1; min-width: 0;
  padding: 12px 16px; border-radius: 1.1rem;
  box-shadow: var(--hundido-suave);
  font-weight: 700; font-size: 15px; color: var(--tinta);
}
.cambio-linea.tu .cambio-globo { text-align: right; }
.cambio-globo .btn-audio {
  display: inline-grid; vertical-align: -8px; width: 26px; height: 26px; margin-left: 4px;
}
.cambio-globo .btn-audio svg { width: 11px; height: 11px; }
"""
io.open(p, 'w', encoding='utf-8').write(s)
print('estilo.css: caras e intercambio')
