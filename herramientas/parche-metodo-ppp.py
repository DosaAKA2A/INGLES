# -*- coding: utf-8 -*-
# Rediseno del metodo del curso (decision de Dosa 2026-08-25: "siento que no he
# aprendido nada util... no he aprendido el porque de cada cosa").
#
# Modelo tomado de los referentes investigados:
#  - British Council (PPP): la lengua nueva se presenta EN CONTEXTO antes que
#    las reglas; practica guiada; produccion al final.
#  - Berlitz (present-practice-perform): cada leccion abre usando el idioma en
#    una situacion real y cierra con el alumno actuando.
#  - Busuu (unico con estudio de eficacia serio): las lecciones se construyen
#    sobre dialogos; el vocabulario sale del dialogo, no al reves.
#
# Flujo nuevo de una leccion:
#   1. escena    - dialogo corto donde SUENA lo nuevo (input primero)
#   2. descubre  - las palabras extraidas de la escena, cada una con su `uso`
#   3. entiende  - comprension de la escena, cero produccion
#   4. practica  - ejercicios guiados, de reconocer a completar
#   5. produce   - el alumno dice/escribe lo suyo
#
# Y el "porque": los ejercicios llevan `por`, que el veredicto muestra SIEMPRE
# (aciertes o falles), para que cada respuesta ensene la regla.
import io
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

def parchea(nombre, cambios):
    p = RAIZ / nombre
    s = io.open(p, encoding='utf-8').read()
    for viejo, nuevo in cambios:
        assert viejo in s, 'NO ENCONTRADO en ' + nombre + ': ' + viejo[:80]
        s = s.replace(viejo, nuevo)
    io.open(p, 'w', encoding='utf-8').write(s)
    print(nombre + ': parcheado')
    return s

# ---------------------------------------------------------------- app.js
parchea('docs/app.js', [

# 1. el veredicto muestra el porque, aciertes o falles
("""  function resuelve(ejPintado, ok, detalle) {
    const ej = ejPintado._crudo || ejPintado;
    if (ejPintado.pista) detalle.pista = ejPintado.pista;""",
 """  function resuelve(ejPintado, ok, detalle) {
    const ej = ejPintado._crudo || ejPintado;
    if (ejPintado.pista) detalle.pista = ejPintado.pista;
    if (ejPintado.por) detalle.por = ejPintado.por;   // el porque de la respuesta""" ),

("""        ${(!ok || detalle.di) ? `<div class="veredicto-detalle">${ok ? '' : '<span class="vd-resp">La correcta era:</span> <b>' + esc(detalle.correcta) + '</b>'}${detalle.di ? ' ' + botonAudio(detalle.di) : ''}</div>` : ''}
        ${detalle.pista ? `<div class="veredicto-pista">${esc(detalle.pista)}</div>` : ''}""",
 """        ${(!ok || detalle.di) ? `<div class="veredicto-detalle">${ok ? '' : '<span class="vd-resp">La correcta era:</span> <b>' + esc(detalle.correcta) + '</b>'}${detalle.di ? ' ' + botonAudio(detalle.di) : ''}</div>` : ''}
        ${detalle.por ? `<div class="veredicto-por">${conNombre(detalle.por)}</div>` : ''}
        ${detalle.pista ? `<div class="veredicto-pista">${esc(detalle.pista)}</div>` : ''}""" ),

# 2. la ficha de fase encima de la consigna
("""    const ej = resuelveNombre(ejCrudo);
    const tipo = ej.tipo;
    let cuerpo = '';""",
 """    const ej = resuelveNombre(ejCrudo);
    const tipo = ej.tipo;
    // La ficha de fase situa al alumno: entender no es lo mismo que producir.
    const FASES = { entiende: '¿Entendiste la escena?', practica: 'Practica', produce: 'Ahora tú' };
    const chipFase = ej.fase && FASES[ej.fase]
      ? `<span class="fase-chip f-${ej.fase}">${FASES[ej.fase]}</span>` : '';
    let cuerpo = '';""" ),

# el chip entra al pintar (una sola vez, delante del cuerpo)
("""    vista().innerHTML = cabecera() + cuerpo;""",
 """    vista().innerHTML = cabecera() + chipFase + cuerpo;""" ),
])

# ---------------------------------------------------------------- lecciones.js
parchea('docs/lecciones.js', [

# 1. vLeccion arranca por la escena si la hay
("""function vLeccion(unidad, idx) {
  vistaActual = 'leccion';
  const l = unidad.lecciones[idx];
  if (l.tipo === 'dialogo') return vLeccionDialogo(unidad, idx);
  const nuevas = (l.nuevas || []).map((i) => ({ i, v: unidad.vocab[i] }));
  if (nuevas.length) return vTarjetas(unidad, idx, nuevas, 0);
  if (l.html) return vLeccionExplica(unidad, idx);
  empiezaEjerciciosDeLeccion(unidad, idx);   // leccion de pura practica
}""",
 """function vLeccion(unidad, idx) {
  vistaActual = 'leccion';
  const l = unidad.lecciones[idx];
  if (l.tipo === 'dialogo') return vLeccionDialogo(unidad, idx);
  if (l.escena) return vEscena(unidad, idx);        // el contexto va PRIMERO
  despuesDeEscena(unidad, idx);
}

// Lo que sigue a la escena: tarjetas si hay palabras, explicacion si la hay,
// y si no, directo a los ejercicios.
function despuesDeEscena(unidad, idx) {
  const l = unidad.lecciones[idx];
  const nuevas = (l.nuevas || []).map((i) => ({ i, v: unidad.vocab[i] }));
  if (nuevas.length) return vTarjetas(unidad, idx, nuevas, 0);
  if (l.html) return vLeccionExplica(unidad, idx);
  empiezaEjerciciosDeLeccion(unidad, idx);
}

// Fase 1 — la escena: un dialogo corto donde suena lo nuevo ANTES de
// estudiarlo. Modelo Busuu/PPP: primero oyes la lengua usada de verdad, con
// su traduccion a la vista; las palabras se estudian despues, ya con contexto.
function vEscena(unidad, idx) {
  const l = unidad.lecciones[idx];
  const e = l.escena;
  let filas = '';
  e.lineas.forEach((x, i) => {
    if (x.t) { filas += `<p class="escena-acota">${esc(x.t)}</p>`; return; }
    filas += `<div class="linea ${x.q === 'B' ? 'b' : ''}">
      <span class="linea-quien">${esc(x.q)}</span>
      <div class="globo" data-idx="${i}">${esc(x.en)}<span class="globo-es">${esc(x.es)}</span></div>
    </div>`;
  });
  vista().innerHTML = `
    <button class="volver" id="salir">${ICO.atras} ${esc(unidad.titulo)}</button>
    <span class="etiqueta">${esc(l.titulo)}</span>
    <h1>${esc(e.titulo || 'La escena')}</h1>
    <p class="entradilla">${esc(e.lugar || '')}</p>
    <p class="gris chica" style="margin-top:6px">Primero escucha: no hace falta entenderlo todo. Toca un globo para repetirlo. Lo nuevo lo estudiamos justo después.</p>
    <div class="acciones" style="margin:14px 0 16px">
      <button class="btn secundario" id="reproducir">${ICO.altavoz} Escuchar la escena</button>
    </div>
    <div class="ficha"><div class="dialogo">${filas}</div></div>
    <div class="pie-accion"><button class="btn ancho acento" id="sigue">Descubre lo que oíste</button></div>`;

  $('#salir').addEventListener('click', () => { Voz.calla(); vUnidad(unidad.id); });

  const habladas = e.lineas.filter((x) => !x.t);
  vista().querySelectorAll('.globo').forEach((g) => {
    g.addEventListener('click', () => {
      const x = e.lineas[+g.dataset.idx];
      document.querySelectorAll('.globo.sonando').forEach((y) => y.classList.remove('sonando'));
      g.classList.add('sonando');
      Voz.di(x.en, { lento: AJ.lento, voz: x.q === 'B' ? 'b' : 'a', alTerminar: () => g.classList.remove('sonando') });
    });
  });

  let tocando = false;
  $('#reproducir').addEventListener('click', () => {
    if (tocando) { tocando = false; Voz.calla(); return; }
    tocando = true;
    const globos = [...vista().querySelectorAll('.globo')];
    const toca = (n) => {
      if (!tocando || n >= habladas.length) { tocando = false; return; }
      const x = habladas[n];
      globos.forEach((y) => y.classList.remove('sonando'));
      globos[n].classList.add('sonando');
      globos[n].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      Voz.di(x.en, { lento: AJ.lento, voz: x.q === 'B' ? 'b' : 'a', alTerminar: () => setTimeout(() => toca(n + 1), 350) });
    };
    toca(0);
  });

  $('#sigue').addEventListener('click', () => { tocando = false; Voz.calla(); despuesDeEscena(unidad, idx); });
}""" ),

# 2. la tarjeta ensena el USO, no solo la traduccion
("""      <p class="carta-es">${esc(mayus(v.es))}</p>
      ${v.nota ? `<p class="carta-nota">${conNombre(v.nota)}</p>` : ''}""",
 """      <p class="carta-es">${esc(mayus(v.es))}</p>
      ${v.uso ? `<p class="carta-uso">${conNombre(v.uso)}</p>` : ''}
      ${v.nota ? `<p class="carta-nota">${conNombre(v.nota)}</p>` : ''}""" ),

# 3. los ejercicios van POR FASES y EN ORDEN (de reconocer a producir);
#    el formato viejo (ejercicios barajados) sigue valiendo mientras se vierten
#    las demas unidades
("""function empiezaEjerciciosDeLeccion(unidad, idx) {
  const l = unidad.lecciones[idx];
  corredor({
    titulo: l.titulo,
    ejercicios: baraja(l.ejercicios),""",
 """function empiezaEjerciciosDeLeccion(unidad, idx) {
  const l = unidad.lecciones[idx];
  // Gradiente PPP: primero comprension de la escena, luego practica guiada,
  // al final produccion. El orden ES el metodo: no se baraja.
  const porFases = [].concat(
    (l.entiende || []).map((e) => Object.assign({ fase: 'entiende' }, e)),
    (l.practica || []).map((e) => Object.assign({ fase: 'practica' }, e)),
    (l.produce || []).map((e) => Object.assign({ fase: 'produce' }, e)));
  corredor({
    titulo: l.titulo,
    ejercicios: porFases.length ? porFases : baraja(l.ejercicios),""" ),

# 4. el dialogo final es tu turno de actuar, no un cuestionario
("""    <p class="entradilla">Todo lo del diálogo ya lo viste en las lecciones. Escúchalo completo, y cuando lo sigas sin leer la traducción, responde las preguntas.</p>""",
 """    <p class="entradilla">Todo esto ya lo aprendiste. Escúchalo completo, y cuando lo sigas sin leer la traducción, te toca actuar: responde como si te hablaran a ti.</p>""" ),
("""    <button class="btn ancho acento" id="preguntas">Responder las preguntas</button>`;""",
 """    <button class="btn ancho acento" id="preguntas">Me hablan a mí: responder</button>`;""" ),
])

# ---------------------------------------------------------------- estilo.css
p = RAIZ / 'docs' / 'estilo.css'
s = io.open(p, encoding='utf-8').read()
s += """

/* ---- metodo PPP: fases, uso y porque ----------------------------------- */
.fase-chip {
  display: inline-flex; align-items: center;
  padding: 6px 14px; border-radius: 999px; margin-bottom: 12px;
  box-shadow: var(--hundido-suave);
  font-weight: 800; font-size: 11.5px; letter-spacing: .13em; text-transform: uppercase;
  color: var(--a-texto);
}
.fase-chip.f-produce { color: #fff; background: var(--grad); box-shadow: var(--relieve); }

/* el "cuando se usa" de una palabra, en su tarjeta */
.carta-uso {
  margin-top: 10px; font-size: 14.5px; font-weight: 700; color: var(--a-texto);
}

/* el porque de una respuesta, dentro del veredicto */
.veredicto-por { margin-top: 7px; font-size: 13.5px; font-weight: 600; opacity: .92; }

/* acotaciones de la escena ("Por la tarde...") */
.escena-acota {
  text-align: center; margin: 14px 0 10px;
  font-weight: 800; font-size: 11.5px; letter-spacing: .14em; text-transform: uppercase;
  color: var(--tinta-3);
}
"""
io.open(p, 'w', encoding='utf-8').write(s)
print('estilo.css: fases, uso, porque y acotaciones')
