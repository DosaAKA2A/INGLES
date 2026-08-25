# -*- coding: utf-8 -*-
# El pulido "nivel Busuu" que pidio Dosa: hoja de retroalimentacion con icono,
# respuesta, pista y boton del color del resultado; celebracion con confeti
# finito y cifra que sube sola; acciones del corredor en pie fijo; transiciones
# de vista; y las tabs escondidas dentro de una leccion.
import io
import re
from pathlib import Path

p = Path(__file__).resolve().parent.parent / 'docs' / 'app.js'
s = io.open(p, encoding='utf-8').read()

def rep(viejo, nuevo, n=1):
    global s
    assert s.count(viejo) >= n, 'NO ENCONTRADO: ' + viejo[:80]
    s = s.replace(viejo, nuevo)

# ---- 1. la pista viaja al veredicto ----
rep("""  function resuelve(ej, ok, detalle) {
    const esRepe = yaRepetido.has(ej);""",
    """  function resuelve(ej, ok, detalle) {
    if (ej.pista) detalle.pista = ej.pista;
    const esRepe = yaRepetido.has(ej);""")

# ---- 2. hoja de retroalimentacion ----
rep("""    const capa = document.createElement('div');
    capa.className = 'veredicto ' + (ok ? 'ok' : 'no');
    capa.innerHTML = `<div class="veredicto-inner">
      <div class="veredicto-texto">
        <div class="veredicto-titulo">${ok ? 'Correcto' : 'No es así'}</div>
        <div class="veredicto-detalle">${detalle.nota ? esc(detalle.nota) : (ok ? '' : 'Respuesta: ' + esc(detalle.correcta))}
          ${detalle.di ? ' ' + botonAudio(detalle.di) : ''}</div>
      </div>
      <button class="btn acento" id="sigue">Seguir</button>
    </div>`;""",
    """    const capa = document.createElement('div');
    capa.className = 'veredicto ' + (ok ? 'ok' : 'no');
    capa.innerHTML = `<div class="veredicto-inner">
      <div class="veredicto-cara">${ok ? ICO.check : ICO.equis}</div>
      <div class="veredicto-texto">
        <div class="veredicto-titulo">${ok ? 'Correcto' : 'No es así'}</div>
        ${detalle.nota ? `<div class="veredicto-detalle">${esc(detalle.nota)}</div>` : ''}
        ${(!ok || detalle.di) ? `<div class="veredicto-detalle">${ok ? '' : '<span class="vd-resp">Respuesta:</span> <b>' + esc(detalle.correcta) + '</b>'}${detalle.di ? ' ' + botonAudio(detalle.di) : ''}</div>` : ''}
        ${detalle.pista ? `<div class="veredicto-pista">${esc(detalle.pista)}</div>` : ''}
      </div>
      <button class="btn ${ok ? 'acento' : 'mal'}" id="sigue">Seguir</button>
    </div>`;
    if (navigator.vibrate) { try { navigator.vibrate(ok ? 12 : [40, 50, 40]); } catch (e) {} }""")

# ---- 3. celebracion ----
rep("""function resumenTanda(aciertos, total, mensaje, alSeguir) {
  const pct = Math.round((aciertos / total) * 100);
  const clase = pct >= NOTA_EXAMEN ? 'verde' : (pct < 50 ? 'rojo' : 'azul');
  vista().innerHTML = `
    <div class="espacio"></div>
    <div class="ficha">
      <span class="etiqueta">${aciertos} de ${total} correctas</span>
      <div class="puntaje-grande ${clase}">${pct}<span class="gris" style="font-size:.45em">%</span></div>
      <p class="entradilla">${esc(mensaje)}</p>
    </div>
    <button class="btn ancho acento" id="seguir">Seguir</button>`;
  $('#seguir').addEventListener('click', alSeguir);
}""",
    """function resumenTanda(aciertos, total, mensaje, alSeguir) {
  const pct = Math.round((aciertos / total) * 100);
  const clase = pct >= NOTA_EXAMEN ? 'verde' : (pct < 50 ? 'rojo' : 'azul');
  const bien = pct >= NOTA_EXAMEN;

  // confeti FINITO (cae y se acaba; nada de animaciones infinitas)
  let confeti = '';
  if (bien) {
    const colores = ['#28bca9', '#fb4673', '#99cccc', '#223634'];
    for (let i = 0; i < 34; i++) {
      confeti += `<i style="left:${(Math.random() * 100).toFixed(1)}%;background:${colores[i % 4]};animation-delay:${(Math.random() * .5).toFixed(2)}s;animation-duration:${(1.3 + Math.random()).toFixed(2)}s"></i>`;
    }
  }

  vista().innerHTML = `
    <div class="celebra">
      ${bien ? `<div class="confeti" aria-hidden="true">${confeti}</div>` : ''}
      <div class="celebra-cara ${bien ? 'bien' : 'meh'}">${bien ? ICO.diploma : ICO.refresco}</div>
      <h1 class="celebra-titulo">${bien ? '¡Así se hace!' : 'Casi, casi'}</h1>
      <p class="entradilla centrado" style="margin:0 auto">${esc(mensaje)}</p>
      <div class="celebra-stats">
        <div class="celebra-stat"><span class="etiqueta" style="margin:0 0 6px">Puntuación</span><div class="puntaje-grande ${clase}" id="cifra">0<span class="cifra-chica">%</span></div></div>
        <div class="celebra-stat"><span class="etiqueta" style="margin:0 0 6px">Correctas</span><div class="puntaje-grande">${aciertos}<span class="cifra-chica">/${total}</span></div></div>
      </div>
    </div>
    <div class="pie-accion"><button class="btn ancho acento" id="seguir">Continuar</button></div>`;

  // la cifra sube sola hasta el resultado
  const cifra = $('#cifra');
  const arranque = performance.now();
  const sube = (t) => {
    const f = Math.min(1, (t - arranque) / 900);
    const suave = 1 - Math.pow(1 - f, 3);
    cifra.innerHTML = Math.round(pct * suave) + '<span class="cifra-chica">%</span>';
    if (f < 1) requestAnimationFrame(sube);
  };
  requestAnimationFrame(sube);
  if (navigator.vibrate && bien) { try { navigator.vibrate([15, 60, 15]); } catch (e) {} }
  $('#seguir').addEventListener('click', alSeguir);
}""")

# ---- 4. icono equis ----
m = re.search(r"  check: '<svg[^\n]+polyline points=\"20 6 9 17 4 12\"/></svg>',", s)
assert m, 'no encontre el icono check'
equis = "\n  equis: '<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 6 6 18M6 6l12 12\"/></svg>',"
s = s.replace(m.group(0), m.group(0) + equis)

# ---- 5. acciones del corredor al pie fijo ----
rep('<div class="acciones"><button class="btn acento" id="comprobar">Comprobar</button></div>',
    '<div class="pie-accion"><button class="btn ancho acento" id="comprobar">Comprobar</button></div>', 1)
s = s.replace('<div class="acciones"><button class="btn acento" id="comprobar">Comprobar</button></div>',
              '<div class="pie-accion"><button class="btn ancho acento" id="comprobar">Comprobar</button></div>')
s = s.replace('<div class="acciones"><button class="btn acento" id="comprobar" disabled>Comprobar</button></div>',
              '<div class="pie-accion"><button class="btn ancho acento" id="comprobar" disabled>Comprobar</button></div>')
s = s.replace('<div class="acciones"><button class="btn secundario" id="saltar">No puedo hablar ahora</button></div>',
              '<div class="pie-accion"><button class="btn ancho secundario" id="saltar">No puedo hablar ahora</button></div>')

# ---- 6. transiciones de vista + modo leccion ----
rep("""pintaBarra();
conectaVozNube();
vInicio();
bajaProgreso();""",
    """// Transicion de entrada en cada cambio de vista, y "modo leccion": dentro del
// corredor y de la celebracion las tabs se esconden, como en las apps de
// idiomas — solo la tarea y el boton de abajo.
new MutationObserver(() => {
  const v = vista();
  document.body.classList.toggle('en-leccion', !!v.querySelector('.ej-cabecera, .celebra'));
  v.classList.remove('vista-entra');
  void v.offsetWidth;
  v.classList.add('vista-entra');
}).observe(vista(), { childList: true });

pintaBarra();
conectaVozNube();
vInicio();
bajaProgreso();""")

io.open(p, 'w', encoding='utf-8').write(s)
print('app.js parcheado')
