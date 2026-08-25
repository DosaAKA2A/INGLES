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

  // El camino de nodos: cada leccion es un circulo en la ruta, como en las
  // apps de idiomas. Con imagen si alguna de sus palabras la tiene; si no, el
  // icono del tipo. Sello: check al terminar, candado si aun no toca.
  const imagenDeLeccion = (l) => {
    for (const i of (l.nuevas || [])) {
      const f = archivoImagen(unidad.vocab[i].en);
      if (f) return `<img src="img/${f}" alt="">`;
    }
    return iconoDe[l.tipo] || ICO.libro;
  };

  let filas = '';
  unidad.lecciones.forEach((l, i) => {
    const hecha = !!d.lecs[l.id];
    const nota = d.notas[l.id];
    // Terminada NO es lo mismo que dominada: si hubo fallos se dice, pero sin
    // regañar — se invita a redondearla, no se bloquea nada.
    const dominada = hecha && (nota == null || nota >= NOTA_DOMINIO);
    const abierta = i === 0 || !!d.lecs[unidad.lecciones[i - 1].id];
    const actual = abierta && !hecha;
    const base = l.sub || (l.tipo === 'vocab' ? (l.nuevas || []).length + ' palabras nuevas' : '');
    const sub = hecha
      ? (dominada ? 'Dominada' + (nota != null ? ' · ' + nota + '%' : '') : 'Completada al ' + nota + '% · puedes redondearla')
      : base;
    filas += `<button class="nodo ${dominada ? 'hecho' : ''} ${hecha && !dominada ? 'a-medias' : ''} ${actual ? 'actual' : ''}" data-leccion="${i}" ${abierta ? '' : 'disabled'}>
      <span class="nodo-circulo">${imagenDeLeccion(l)}
        ${dominada ? `<span class="nodo-sello">${ICO.check}</span>`
          : (hecha ? `<span class="nodo-sello afinar">${ICO.refresco}</span>`
          : (abierta ? '' : `<span class="nodo-sello candado">${ICO.candado}</span>`))}
      </span>
      <span class="nodo-info"><span class="nodo-titulo">${esc(l.titulo)}</span><span class="nodo-sub">${esc(terminos(sub))}</span></span>
    </button>`;
  });

  vista().innerHTML = `
    <button class="volver" id="volver">${ICO.atras} Todas las unidades</button>
    <span class="etiqueta">Unidad ${String(CURSO.findIndex((x) => x.id === unidad.id) + 1).padStart(2, '0')} &middot; ${unidad.nivel}</span>
    <h1>${esc(unidad.titulo)}</h1>
    <p class="entradilla">${esc(terminos(unidad.descripcion))}</p>
    <div class="camino">
      ${filas}
      <button class="nodo ${d.examen >= NOTA_EXAMEN ? 'hecho' : (todasHechas ? 'actual' : '')}" data-accion="examen" ${todasHechas ? '' : 'disabled'}>
        <span class="nodo-circulo">${ICO.diploma}
          ${d.examen >= NOTA_EXAMEN ? `<span class="nodo-sello">${ICO.check}</span>` : (todasHechas ? '' : `<span class="nodo-sello candado">${ICO.candado}</span>`)}
        </span>
        <span class="nodo-info"><span class="nodo-titulo">Examen</span><span class="nodo-sub">${TANDA_EXAMEN} preguntas de lo visto. Con ${NOTA_EXAMEN}% se abre la siguiente unidad</span></span>
        ${d.examen >= 0 ? `<span class="nodo-extra">${d.examen}%</span>` : ''}
      </button>
      <button class="nodo" data-accion="ensayo">
        <span class="nodo-circulo">${ICO.pluma}</span>
        <span class="nodo-info"><span class="nodo-titulo">Ensayo</span><span class="nodo-sub">${esc(unidad.ensayo.resumen)}</span></span>
        ${d.ensayo >= 0 ? `<span class="nodo-extra">${d.ensayo}</span>` : ''}
      </button>
    </div>
    ${todasHechas
      ? (unidad.lecciones.some((l) => d.notas[l.id] != null && d.notas[l.id] < NOTA_DOMINIO)
        ? '<p class="nota-afinar">Puedes repetir las lecciones marcadas para redondearlas. No es obligatorio: el examen ya está abierto.</p>'
        : '')
      : '<p class="gris chica" style="margin-top:16px">Las lecciones se abren en orden; el examen, al terminarlas todas.</p>'}`;

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
  reparte(e.reparto);
  let filas = '';
  e.lineas.forEach((x, i) => {
    if (x.t) { filas += `<p class="escena-acota">${esc(x.t)}</p>`; return; }
    filas += `<div class="linea ${x.q === 'B' ? 'b' : ''}">
      ${caraDe(x.q)}
      <div class="globo" data-idx="${i}"><span class="globo-quien">${esc(personaje(x.q).nombre)}</span>${esc(x.en)}<span class="globo-es">${esc(x.es)}</span></div>
    </div>`;
  });
  vista().innerHTML = `
    <button class="volver" id="salir">${ICO.atras} ${esc(unidad.titulo)}</button>
    <span class="etiqueta">${esc(l.titulo)}</span>
    <h1>${esc(e.titulo || 'La escena')}</h1>
    <p class="entradilla">${esc(terminos(e.lugar || ''))}</p>
    <p class="gris chica" style="margin-top:6px">Primero escucha: no hace falta entenderlo todo. Toca un globo para repetirlo. Lo nuevo lo estudiamos justo después.</p>
    <div class="acciones" style="margin:14px 0 16px">
      <button class="btn secundario" id="reproducir">${ICO.altavoz} Escuchar la escena</button>
    </div>
    <div class="ficha escena"><div class="dialogo">${filas}</div></div>
    <div class="pie-accion"><button class="btn ancho acento" id="sigue">Descubre lo que oíste</button></div>`;

  $('#salir').addEventListener('click', () => { Voz.calla(); vUnidad(unidad.id); });

  const habladas = e.lineas.filter((x) => !x.t);
  vista().querySelectorAll('.globo').forEach((g) => {
    g.addEventListener('click', () => {
      const x = e.lineas[+g.dataset.idx];
      document.querySelectorAll('.globo.sonando').forEach((y) => y.classList.remove('sonando'));
      g.classList.add('sonando');
      Voz.di(x.en, { lento: AJ.lento, voz: personaje(x.q).voz, alTerminar: () => g.classList.remove('sonando') });
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
      Voz.di(x.en, { lento: AJ.lento, voz: personaje(x.q).voz, alTerminar: () => setTimeout(() => toca(n + 1), 350) });
    };
    toca(0);
  });

  $('#sigue').addEventListener('click', () => { tocando = false; Voz.calla(); despuesDeEscena(unidad, idx); });
}

// El ejemplo de una palabra es un INTERCAMBIO: Aria te habla a ti y debajo va
// lo que responderias tu. Antes era una frase suelta con su propio boton de
// audio, casi identica al titular de la tarjeta: dos botones para lo mismo.
function cambioDe(v) {
  if (!v.cambio) return v.ej ? `<p class="carta-ej">${esc(v.ej)} ${botonAudio(v.ej)}</p>` : '';
  reparte(null);                       // en la tarjeta habla siempre Aria
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
      <p class="carta-en">${esc(mayus(v.en))} ${botonAudio(v.en)}</p>
      <p class="carta-es">${esc(mayus(v.es))}</p>
      ${v.uso ? `<p class="carta-uso">${terminos(conNombre(v.uso))}</p>` : ''}
      ${v.nota ? `<p class="carta-nota">${terminos(conNombre(v.nota))}</p>` : ''}
      ${cambioDe(v)}
    </div>
    <div class="acciones">
      ${pos > 0 ? `<button class="btn secundario" id="antes">${ICO.atras} Anterior</button>` : ''}
      <button class="btn acento" id="sigue" style="flex:1">${ultima ? (l.html ? 'Ver la explicación' : 'A practicar') : 'Siguiente'}</button>
    </div>`;
  Voz.di(v.en, { lento: AJ.lento });
  // la linea del alumno suena con la otra voz: en un intercambio, dos personas
  vista().querySelectorAll('.btn-audio.voz-b').forEach((b) => {
    b.addEventListener('click', (e) => { e.stopPropagation(); Voz.di(b.dataset.di, { lento: AJ.lento, voz: 'b' }); }, true);
  });
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
    <div class="ficha gram">${conNombre(l.html)}</div>
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
  // Gradiente PPP: primero comprension de la escena, luego practica guiada,
  // al final produccion. El orden ES el metodo: no se baraja.
  const porFases = [].concat(
    (l.entiende || []).map((e) => Object.assign({ fase: 'entiende' }, e)),
    (l.practica || []).map((e) => Object.assign({ fase: 'practica' }, e)),
    (l.produce || []).map((e) => Object.assign({ fase: 'produce' }, e)));
  corredor({
    titulo: l.titulo,
    ejercicios: porFases.length ? porFases : baraja(l.ejercicios),
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
  const nota = Math.round((aciertos / total) * 100);
  d.lecs[l.id] = 1;
  d.notas[l.id] = Math.max(d.notas[l.id] || 0, nota);   // se guarda la mejor
  if (primeraVez) daXP(20); else guarda();

  const hay = idx + 1 < unidad.lecciones.length;
  const siguiente = hay ? `Sigue: ${unidad.lecciones[idx + 1].titulo}.` : 'El examen quedó abierto.';
  const mensaje = d.notas[l.id] >= NOTA_DOMINIO
    ? `Lección dominada. ${siguiente}`
    : `Lección completada. Quedaron cosas por afinar: puedes repetirla cuando quieras para redondearla. ${siguiente}`;
  resumenTanda(aciertos, total, mensaje, () => vUnidad(unidad.id));
}

// ---- leccion de dialogo -----------------------------------------------------

function vLeccionDialogo(unidad, idx) {
  const l = unidad.lecciones[idx];
  const dlg = l.dialogo;
  reparte(dlg.reparto);
  let lineas = '';
  dlg.lineas.forEach((x, i) => {
    lineas += `<div class="linea ${x.q === 'B' ? 'b' : ''}">
      ${caraDe(x.q)}
      <div class="globo" data-idx="${i}"><span class="globo-quien">${esc(personaje(x.q).nombre)}</span>${esc(x.en)}<span class="globo-es">${esc(x.es)}</span></div>
    </div>`;
  });
  vista().innerHTML = `
    <button class="volver" id="volver">${ICO.atras} ${esc(unidad.titulo)}</button>
    <span class="etiqueta">${esc(l.titulo)}</span>
    <h1>${esc(dlg.titulo)}</h1>
    <p class="entradilla">Todo esto ya lo aprendiste. Escúchalo completo, y cuando lo sigas sin leer la traducción, te toca actuar: responde como si te hablaran a ti.</p>
    <div class="acciones" style="margin:14px 0 16px">
      <button class="btn secundario" id="reproducir">${ICO.altavoz} Reproducir todo</button>
    </div>
    <div class="ficha"><div class="dialogo">${lineas}</div></div>
    <button class="btn ancho acento" id="preguntas">Me hablan a mí: responder</button>`;

  $('#volver').addEventListener('click', () => { Voz.calla(); vUnidad(unidad.id); });

  vista().querySelectorAll('.globo').forEach((g) => {
    g.addEventListener('click', () => {
      const x = dlg.lineas[+g.dataset.idx];
      document.querySelectorAll('.globo.sonando').forEach((y) => y.classList.remove('sonando'));
      g.classList.add('sonando');
      Voz.di(x.en, { lento: AJ.lento, voz: personaje(x.q).voz, alTerminar: () => g.classList.remove('sonando') });
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
      Voz.di(x.en, { lento: AJ.lento, voz: personaje(x.q).voz, alTerminar: () => setTimeout(() => toca(i + 1), 350) });
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
