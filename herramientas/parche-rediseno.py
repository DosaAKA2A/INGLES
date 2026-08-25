# Adapta el markup de app.js al CSS rediseñado (lenguaje IRIS): filas de unidad
# con anillo de avance en vez de tarjeta con barra, vocabulario con ilustracion,
# cifras grandes sin circulo, e iconos Lucide de trazo fino.
import io
from pathlib import Path

p = Path(__file__).resolve().parent.parent / 'docs' / 'app.js'
s = io.open(p, encoding='utf-8').read()

def rep(a, b):
    global s
    assert a in s, 'NO ENCONTRADO: ' + a[:70]
    s = s.replace(a, b, 1)

# ---- 1. iconos: trazo 1.75 (Lucide) en vez de 2 ----
s = s.replace('stroke-width="2"', 'stroke-width="1.75"')
s = s.replace('stroke-width="2.5"', 'stroke-width="2.25"')

# ---- 2. la fila de unidad: anillo de avance, sin barra ni tarjeta ----
rep("""function pctUnidad(unidad) {""",
    """// Anillo de avance: 26px, r=11 -> circunferencia 69,1.
function anilloSVG(pct) {
  const c = 69.1;
  return `<svg class="anillo" viewBox="0 0 26 26" aria-hidden="true">
    <circle class="pista" cx="13" cy="13" r="11"/>
    <circle class="valor" cx="13" cy="13" r="11" stroke-dasharray="${(c * pct / 100).toFixed(1)} ${c}"/>
  </svg>`;
}

function pctUnidad(unidad) {""")

rep("""  let html = `<h1>Inglés desde cero</h1>
    <p class="gris">Un camino: cada unidad se abre aprobando el examen de la anterior con ${NOTA_EXAMEN}% o más.</p>
    <div class="unidades">`;""",
    """  const hechas = CURSO.filter((x) => examenAprobado(x.id)).length;
  let html = `<span class="etiqueta">Nivel A0 &ndash; A1</span>
    <h1>Inglés desde cero</h1>
    <p class="entradilla">Doce unidades. Cada una se abre aprobando el examen de la anterior.</p>
    <div class="tarjetas-stats">
      <div class="stat"><div class="stat-num">${hechas}<span class="gris" style="font-size:20px">/${CURSO.length}</span></div><div class="stat-nombre">unidades aprobadas</div></div>
      <div class="stat"><div class="stat-num oro">${P.racha.dias}</div><div class="stat-nombre">días de racha</div></div>
      <div class="stat"><div class="stat-num azul">${P.xp}</div><div class="stat-nombre">experiencia</div></div>
    </div>
    <div class="unidades">`;""")

rep("""    html += `<button class="unidad ${abierta ? '' : 'bloqueada'} ${hecha ? 'hecha' : ''} ${actual ? 'actual' : ''}" data-uid="${unidad.id}" ${abierta ? '' : 'disabled'}>
      <span class="unidad-num">${hecha ? ICO.check : idx + 1}</span>
      <span class="unidad-info">
        <span class="unidad-titulo">${esc(unidad.titulo)}</span>
        <span class="unidad-sub">${esc(unidad.descripcion)}</span>
        ${abierta ? `<span class="progreso-mini"><i style="width:${pct}%"></i></span>` : ''}
      </span>
      <span class="unidad-nivel">${abierta ? unidad.nivel : ''}${abierta ? '' : ICO.candado}</span>
    </button>`;""",
    """    html += `<button class="unidad ${abierta ? '' : 'bloqueada'} ${hecha ? 'hecha' : ''} ${actual ? 'actual' : ''}" data-uid="${unidad.id}" ${abierta ? '' : 'disabled'}>
      <span class="unidad-num">${hecha ? ICO.check : String(idx + 1).padStart(2, '0')}</span>
      <span class="unidad-info">
        <span class="unidad-titulo">${esc(unidad.titulo)}</span>
        <span class="unidad-sub">${esc(unidad.descripcion)}</span>
      </span>
      <span class="unidad-cola">
        ${abierta ? (pct > 0 && pct < 100 ? anilloSVG(pct) : '') : ICO.candado.replace('<svg', '<svg class="candado"')}
        <span class="nivel">${unidad.nivel}</span>
      </span>
    </button>`;""")

# ---- 3. vocabulario con ilustracion ----
rep("""  let filas = '';
  unidad.vocab.forEach((v) => {
    filas += `<div class="vocab">
      ${botonAudio(v.en)}
      <span class="vocab-en">${esc(v.en)}${v.ej ? `<br><span class="vocab-ej">${esc(v.ej)}</span>` : ''}</span>
      <span class="vocab-es">${esc(v.es)}</span>
    </div>`;
  });""",
    """  let filas = '';
  unidad.vocab.forEach((v) => {
    filas += `<div class="vocab">
      ${imagenDe(v.en)}
      <span class="vocab-txt">
        <span class="vocab-en">${esc(v.en)}</span> <span class="vocab-es">${esc(v.es)}</span>
        ${v.ej ? `<span class="vocab-ej">${esc(v.ej)}</span>` : ''}
      </span>
      ${botonAudio(v.en)}
    </div>`;
  });""")

rep("""    <button class="volver" id="volver">${ICO.atras} ${esc(unidad.titulo)}</button>
    <h1>Vocabulario</h1>
    <p class="gris">Toca el altavoz para escuchar cada palabra. Después la práctica y el repaso se encargan de que se te peguen.</p>
    <div class="ficha"><div class="vocab-lista">${filas}</div></div>
    <button class="btn ancho" id="listo">Ya las escuché todas</button>`;""",
    """    <button class="volver" id="volver">${ICO.atras} ${esc(unidad.titulo)}</button>
    <span class="etiqueta">Unidad ${esc(unidad.titulo)}</span>
    <h1>Vocabulario</h1>
    <p class="entradilla">${unidad.vocab.length} palabras. Toca el altavoz para escucharlas; la práctica y el repaso se encargan del resto.</p>
    <div class="espacio"></div>
    <div class="ficha"><div class="vocab-lista">${filas}</div></div>
    <button class="btn ancho" id="listo">Ya las escuché todas</button>`;""")

# ---- 4. las cifras grandes dejan de ser un circulo ----
rep("""  const clase = c.puntaje >= 75 ? 'verde' : (c.puntaje < 50 ? 'rojo' : '');""",
    """  const clase = c.puntaje >= 75 ? 'verde' : (c.puntaje < 50 ? 'rojo' : 'azul');""")

rep("""    <div class="ficha centrado">
      <div class="puntaje-grande ${clase}">${c.puntaje}</div>
      <p>${esc(c.resumen || '')}</p>
    </div>""",
    """    <div class="ficha">
      <span class="etiqueta">Tu puntaje</span>
      <div class="puntaje-grande ${clase}">${c.puntaje}<span class="gris" style="font-size:.4em">/100</span></div>
      <p class="entradilla">${esc(c.resumen || '')}</p>
    </div>""")

rep("""      <span class="tachado">${esc(x.original)}</span> &rarr; <span class="bueno">${esc(x.corregido)}</span>""",
    """      <span class="tachado">${esc(x.original)}</span><span class="flecha">&rarr;</span><span class="bueno">${esc(x.corregido)}</span>""")

rep("""  const clase = pct >= NOTA_EXAMEN ? 'verde' : (pct < 50 ? 'rojo' : '');
  vista().innerHTML = `
    <div class="espacio"></div>
    <div class="ficha centrado">
      <div class="puntaje-grande ${clase}">${pct}%</div>
      <p style="font-weight:650">${aciertos} de ${total}</p>
      <p class="gris">${esc(mensaje)}</p>
    </div>
    <button class="btn ancho" id="seguir">Seguir</button>`;""",
    """  const clase = pct >= NOTA_EXAMEN ? 'verde' : (pct < 50 ? 'rojo' : 'azul');
  vista().innerHTML = `
    <div class="espacio"></div>
    <div class="ficha">
      <span class="etiqueta">${aciertos} de ${total} correctas</span>
      <div class="puntaje-grande ${clase}">${pct}<span class="gris" style="font-size:.45em">%</span></div>
      <p class="entradilla">${esc(mensaje)}</p>
    </div>
    <button class="btn ancho acento" id="seguir">Seguir</button>`;""")

# ---- 5. ilustracion de apoyo en los ejercicios de vocabulario ----
rep("""    if (tipo === 'opcion' || tipo === 'huecos') {
      const enun = tipo === 'huecos' ? esc(ej.antes) + ' ____ ' + esc(ej.despues || '') : esc(ej.q);
      cuerpo = `<p class="consigna">${consignas[tipo]}</p>
        <p class="enunciado">${ej.audio ? botonAudio(ej.audio) : ''}${enun}</p>""",
    """    if (tipo === 'opcion' || tipo === 'huecos') {
      const enun = tipo === 'huecos' ? esc(ej.antes) + ' ____ ' + esc(ej.despues || '') : esc(ej.q);
      cuerpo = `<p class="consigna">${consignas[tipo]}</p>
        ${ej.audio ? ilustracionGrande(ej.audio) : ''}
        <p class="enunciado">${ej.audio ? botonAudio(ej.audio) : ''}${enun}</p>""")

rep("""    } else if (tipo === 'traduce') {
      cuerpo = `<p class="consigna">${consignas.traduce}</p>
        <p class="enunciado">${esc(ej.es)}</p>""",
    """    } else if (tipo === 'traduce') {
      cuerpo = `<p class="consigna">${consignas.traduce}</p>
        ${ilustracionGrande(ej.en[0])}
        <p class="enunciado">${esc(ej.es)}</p>""")

# ---- 6. helpers de imagen ----
rep("""function botonAudio(texto, extra = '') {""",
    """// Ilustraciones del vocabulario (docs/img/, generadas con Magnific). Si una
// palabra no tiene la suya, no se deja hueco: se cae al icono.
function claveImagen(texto) {
  return String(texto).toLowerCase().replace(/[^a-z' ]/g, '').trim();
}
function archivoImagen(texto) {
  return (typeof IMG_MAPA !== 'undefined') && IMG_MAPA[claveImagen(texto)];
}
function imagenDe(texto) {
  const f = archivoImagen(texto);
  return f ? `<img class="vocab-imagen" src="img/${f}" alt="" loading="lazy">`
           : `<span class="vocab-imagen vacia">${ICO.libro}</span>`;
}
function ilustracionGrande(texto) {
  const f = archivoImagen(texto);
  return f ? `<img class="ej-imagen" src="img/${f}" alt="" loading="lazy">` : '';
}

function botonAudio(texto, extra = '') {""")

# ---- 7. botones principales al acento ----
s = s.replace('<button class="btn" id="comprobar">', '<button class="btn acento" id="comprobar">')
s = s.replace("<button class=\"btn\" id=\"enviar\" disabled>", "<button class=\"btn acento\" id=\"enviar\" disabled>")
s = s.replace("<button class=\"btn\" id=\"mandar\">", "<button class=\"btn acento\" id=\"mandar\">")
s = s.replace("<button class=\"btn\" id=\"sigue\">Seguir</button>", "<button class=\"btn acento\" id=\"sigue\">Seguir</button>")
s = s.replace("<button class=\"btn\" id=\"pase-si\"", "<button class=\"btn acento\" id=\"pase-si\"")

io.open(p, 'w', encoding='utf-8').write(s)
print('app.js adaptado')
