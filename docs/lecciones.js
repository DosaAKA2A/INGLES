/* INGLES — el formato nuevo de unidad: LECCIONES cortas y en orden.
   Modelo tomado de como ensenan Duolingo/Babbel (metodo PPP): cada leccion
   PRESENTA pocas cosas nuevas (tarjetas con imagen, audio y ejemplo) y las
   PRACTICA ahi mismo, usando SOLO lo ya presentado. El examen se abre al
   terminar todas las lecciones y se valida contra lo ensenado
   (herramientas/valida-ensenanza.js).

   Esquema de una unidad en formato nuevo:
   {
     id, nivel, titulo, descripcion,
     vocab: [...],                       // el banco completo (repaso + imagenes)
     lecciones: [{
       id: 'l1',
       tipo: 'vocab' | 'gramatica' | 'dialogo',
       titulo, sub,
       nuevas: [indices de vocab],       // que presenta esta leccion
       html: '...',                      // solo gramatica
       dialogo: {titulo, lineas, preguntas},   // solo dialogo
       regalos: ['am','are'],            // palabras que ENSENA la explicacion
                                         // (las lee el validador, no la UI)
       ejercicios: [...]
     }],
     examen: [...], ensayo: {...}
   }
   Se carga despues de app.js y usa sus funciones globales (corredor, u, daXP,
   ICO, esc, botonAudio, imagenDe...). */

'use strict';

function vUnidadNueva(unidad) {
  const d = u(unidad.id);
  const todasHechas = unidad.lecciones.every((l) => d.lecs[l.id]);
  const iconoDe = { vocab: ICO.libro, gramatica: ICO.regla, dialogo: ICO.charla, practica: ICO.pesa };

  let filas = '';
  unidad.lecciones.forEach((l, i) => {
    const hecha = !!d.lecs[l.id];
    const abierta = i === 0 || !!d.lecs[unidad.lecciones[i - 1].id];
    const sub = l.sub || (l.tipo === 'vocab' ? (l.nuevas || []).length + ' palabras nuevas' : '');
    filas += `<button class="bloque ${hecha ? 'hecho' : ''} ${abierta ? '' : 'cerrado'}" data-leccion="${i}" ${abierta ? '' : 'disabled'}>
      <span class="bloque-icono">${iconoDe[l.tipo] || ICO.libro}</span>
      <span><span class="bloque-titulo">${esc(l.titulo)}</span><br><span class="bloque-sub">${esc(sub)}</span></span>
      <span class="bloque-extra ${hecha ? 'bien' : ''}">${hecha ? ICO.check : String(i + 1).padStart(2, '0')}</span>
    </button>`;
  });

  vista().innerHTML = `
    <button class="volver" id="volver">${ICO.atras} Todas las unidades</button>
    <span class="etiqueta">Unidad ${String(CURSO.findIndex((x) => x.id === unidad.id) + 1).padStart(2, '0')} &middot; ${unidad.nivel}</span>
    <h1>${esc(unidad.titulo)}</h1>
    <p class="entradilla">${esc(unidad.descripcion)}</p>
    <div class="bloques">
      ${filas}
      <button class="bloque ${d.examen >= NOTA_EXAMEN ? 'hecho' : ''} ${todasHechas ? '' : 'cerrado'}" data-accion="examen" ${todasHechas ? '' : 'disabled'}>
        <span class="bloque-icono">${ICO.diploma}</span>
        <span><span class="bloque-titulo">Examen</span><br><span class="bloque-sub">${TANDA_EXAMEN} preguntas de lo visto. Con ${NOTA_EXAMEN}% se abre la siguiente unidad</span></span>
        <span class="bloque-extra ${d.examen >= NOTA_EXAMEN ? 'bien' : ''}">${d.examen >= 0 ? d.examen + '%' : (todasHechas ? '' : ICO.candado.replace('<svg', '<svg class="candado"'))}</span>
      </button>
      <button class="bloque" data-accion="ensayo">
        <span class="bloque-icono">${ICO.pluma}</span>
        <span><span class="bloque-titulo">Ensayo</span><br><span class="bloque-sub">${esc(unidad.ensayo.resumen)}</span></span>
        <span class="bloque-extra ${d.ensayo >= 60 ? 'bien' : ''}">${d.ensayo >= 0 ? d.ensayo : ''}</span>
      </button>
    </div>
    ${todasHechas ? '' : '<p class="gris chica" style="margin-top:16px">Las lecciones se abren en orden; el examen, al terminarlas todas.</p>'}`;

  $('#volver').addEventListener('click', vInicio);
  vista().querySelectorAll('[data-leccion]').forEach((b) => {
    b.addEventListener('click', () => { Voz.calla(); vLeccion(unidad, +b.dataset.leccion); });
  });
  const bExamen = vista().querySelector('[data-accion="examen"]');
  if (todasHechas) bExamen.addEventListener('click', () => { Voz.calla(); empiezaExamen(unidad); });
  vista().querySelector('[data-accion="ensayo"]').addEventListener('click', () => { Voz.calla(); vEnsayo(unidad); });
}

// ---- una leccion ------------------------------------------------------------

function vLeccion(unidad, idx) {
  vistaActual = 'leccion';
  const l = unidad.lecciones[idx];
  if (l.tipo === 'dialogo') return vLeccionDialogo(unidad, idx);
  const nuevas = (l.nuevas || []).map((i) => ({ i, v: unidad.vocab[i] }));
  if (nuevas.length) return vTarjetas(unidad, idx, nuevas, 0);
  if (l.html) return vLeccionExplica(unidad, idx);
  empiezaEjerciciosDeLeccion(unidad, idx);   // leccion de pura practica
}

// Fase "Aprende": una tarjeta por palabra nueva, con imagen, audio y ejemplo.
function vTarjetas(unidad, idx, nuevas, pos) {
  const l = unidad.lecciones[idx];
  const { v } = nuevas[pos];
  const ultima = pos === nuevas.length - 1;
  vista().innerHTML = `
    <div class="ej-cabecera">
      <button class="volver" id="salir" style="margin:0" title="Salir">${ICO.atras}</button>
      <div class="ej-barra"><i style="width:${Math.round(((pos + 1) / nuevas.length) * 100)}%"></i></div>
      <span class="ej-contador">${pos + 1}/${nuevas.length}</span>
    </div>
    <p class="consigna">Palabra nueva</p>
    <div class="carta">
      ${archivoImagen(v.en) ? `<img class="carta-imagen" src="img/${archivoImagen(v.en)}" alt="">` : ''}
      <p class="carta-en">${esc(v.en)} ${botonAudio(v.en)}</p>
      <p class="carta-es">${esc(v.es)}</p>
      ${v.ej ? `<p class="carta-ej">${esc(v.ej)} ${botonAudio(v.ej)}</p>` : ''}
    </div>
    <div class="acciones">
      ${pos > 0 ? `<button class="btn secundario" id="antes">${ICO.atras} Anterior</button>` : ''}
      <button class="btn acento" id="sigue" style="flex:1">${ultima ? (l.html ? 'Ver la explicación' : 'A practicar') : 'Siguiente'}</button>
    </div>`;
  Voz.di(v.en, { lento: AJ.lento });
  $('#salir').addEventListener('click', () => { Voz.calla(); vUnidad(unidad.id); });
  if (pos > 0) $('#antes').addEventListener('click', () => vTarjetas(unidad, idx, nuevas, pos - 1));
  $('#sigue').addEventListener('click', () => {
    Voz.calla();
    if (!ultima) return vTarjetas(unidad, idx, nuevas, pos + 1);
    if (l.html) vLeccionExplica(unidad, idx);
    else empiezaEjerciciosDeLeccion(unidad, idx);
  });
}

// Fase de explicacion (gramatica), con los .ej tocables como siempre.
function vLeccionExplica(unidad, idx) {
  const l = unidad.lecciones[idx];
  vista().innerHTML = `
    <button class="volver" id="volver">${ICO.atras} ${esc(unidad.titulo)}</button>
    <span class="etiqueta">${esc(l.titulo)}</span>
    <div class="ficha gram">${l.html}</div>
    <button class="btn ancho acento" id="practicar">A practicar</button>`;
  vista().querySelectorAll('.ej').forEach((n) => {
    n.title = 'Escuchar';
    n.addEventListener('click', () => Voz.di(n.textContent, { lento: AJ.lento }));
  });
  $('#volver').addEventListener('click', () => vUnidad(unidad.id));
  $('#practicar').addEventListener('click', () => { Voz.calla(); empiezaEjerciciosDeLeccion(unidad, idx); });
}

function empiezaEjerciciosDeLeccion(unidad, idx) {
  const l = unidad.lecciones[idx];
  corredor({
    titulo: l.titulo,
    ejercicios: baraja(l.ejercicios),
    repetirFallos: true,
    alAcierto: (ej, primerIntento) => {
      daXP(primerIntento ? 10 : 5);
      if (ej.vocabIdx != null) anotaSRS(unidad.id, ej.vocabIdx, primerIntento);
    },
    alFallo: (ej) => { if (ej.vocabIdx != null) anotaSRS(unidad.id, ej.vocabIdx, false); },
    alTerminar: (aciertos, total) => cierraLeccion(unidad, idx, aciertos, total)
  });
}

function cierraLeccion(unidad, idx, aciertos, total) {
  const d = u(unidad.id);
  const l = unidad.lecciones[idx];
  const primeraVez = !d.lecs[l.id];
  d.lecs[l.id] = 1;
  if (primeraVez) daXP(20); else guarda();
  const hay = idx + 1 < unidad.lecciones.length;
  resumenTanda(aciertos, total,
    hay ? `Lección lista. Sigue: ${unidad.lecciones[idx + 1].titulo}.`
        : 'Todas las lecciones listas: el examen quedó abierto.',
    () => vUnidad(unidad.id));
}

// ---- leccion de dialogo -----------------------------------------------------

function vLeccionDialogo(unidad, idx) {
  const l = unidad.lecciones[idx];
  const dlg = l.dialogo;
  let lineas = '';
  dlg.lineas.forEach((x, i) => {
    lineas += `<div class="linea ${x.q === 'B' ? 'b' : ''}">
      <span class="linea-quien">${esc(x.q)}</span>
      <div class="globo" data-idx="${i}">${esc(x.en)}<span class="globo-es">${esc(x.es)}</span></div>
    </div>`;
  });
  vista().innerHTML = `
    <button class="volver" id="volver">${ICO.atras} ${esc(unidad.titulo)}</button>
    <span class="etiqueta">${esc(l.titulo)}</span>
    <h1>${esc(dlg.titulo)}</h1>
    <p class="entradilla">Todo lo del diálogo ya lo viste en las lecciones. Escúchalo completo, y cuando lo sigas sin leer la traducción, responde las preguntas.</p>
    <div class="acciones" style="margin:14px 0 16px">
      <button class="btn secundario" id="reproducir">${ICO.altavoz} Reproducir todo</button>
    </div>
    <div class="ficha"><div class="dialogo">${lineas}</div></div>
    <button class="btn ancho acento" id="preguntas">Responder las preguntas</button>`;

  $('#volver').addEventListener('click', () => { Voz.calla(); vUnidad(unidad.id); });

  vista().querySelectorAll('.globo').forEach((g) => {
    g.addEventListener('click', () => {
      const x = dlg.lineas[+g.dataset.idx];
      document.querySelectorAll('.globo.sonando').forEach((y) => y.classList.remove('sonando'));
      g.classList.add('sonando');
      Voz.di(x.en, { lento: AJ.lento, voz: x.q === 'B' ? 'b' : 'a', alTerminar: () => g.classList.remove('sonando') });
    });
  });

  let tocando = false;
  $('#reproducir').addEventListener('click', () => {
    if (tocando) { tocando = false; Voz.calla(); return; }
    tocando = true;
    const globos = vista().querySelectorAll('.globo');
    const toca = (i) => {
      if (!tocando || i >= dlg.lineas.length) { tocando = false; return; }
      const x = dlg.lineas[i];
      globos.forEach((y) => y.classList.remove('sonando'));
      globos[i].classList.add('sonando');
      globos[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      Voz.di(x.en, { lento: AJ.lento, voz: x.q === 'B' ? 'b' : 'a', alTerminar: () => setTimeout(() => toca(i + 1), 350) });
    };
    toca(0);
  });

  $('#preguntas').addEventListener('click', () => {
    tocando = false; Voz.calla();
    corredor({
      titulo: l.titulo,
      ejercicios: dlg.preguntas,
      repetirFallos: true,
      alAcierto: () => daXP(10),
      alTerminar: (aciertos, total) => cierraLeccion(unidad, idx, aciertos, total)
    });
  });
}
