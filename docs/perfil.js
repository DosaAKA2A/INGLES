/* INGLES — cuestionario de entrada (referencia: el onboarding de Busuu).
   Dos pasos en la primera visita: tu nombre y PARA QUE aprendes ingles.
   No es decoracion: el perfil viaja al worker y el tutor de la IA te llama
   por tu nombre y orienta ejemplos y preguntas a tu motivo. Se puede cambiar
   despues desde Ajustes. Se guarda en P.perfil = { nombre, motivo } y se
   sincroniza con el resto del progreso. */

'use strict';

const MOTIVOS = [
  { id: 'trabajo', titulo: 'Trabajo', icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 13h20"/></svg>' },
  { id: 'estudios', titulo: 'Estudios', icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m22 9-10-5L2 9l10 5 10-5z"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/><path d="M22 9v6"/></svg>' },
  { id: 'viajes', titulo: 'Viajes', icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>' },
  { id: 'cultura', titulo: 'Cultura: series, música, juegos', icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1-.3 2.1.3 2.4 1.4z"/><path d="m6.2 5.3 3.1 3.9m2.2-5.2 3.1 3.9"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>' },
  { id: 'familia', titulo: 'Familia y amigos', icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/></svg>' },
  { id: 'reto', titulo: 'Ponerme a prueba', icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>' },
  { id: 'otro', titulo: 'Otro motivo', icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>' }
];

function etiquetaMotivo(id) {
  const m = MOTIVOS.find((x) => x.id === id);
  return m ? m.titulo : '';
}

const METAS = [
  { min: 5, nombre: 'Ocasional' },
  { min: 10, nombre: 'Habitual' },
  { min: 15, nombre: 'Frecuente' },
  { min: 25, nombre: 'Intensivo' }
];

function vOnboarding(paso, borrador) {
  vistaActual = 'onboarding';
  paso = paso || 1;
  borrador = borrador || { nombre: (P.perfil && P.perfil.nombre) || '', motivo: (P.perfil && P.perfil.motivo) || '', meta: (P.perfil && P.perfil.meta) || 0 };

  if (paso === 1) {
    vista().innerHTML = `
      <div class="onboarding">
        <div class="ej-cabecera" style="visibility:hidden"><span class="ej-contador">.</span></div>
        <div class="onb-paso"><div class="ej-barra"><i style="width:33%"></i></div></div>
        <div class="onb-centro">
          <span class="onb-marca">EN</span>
          <h1 class="centrado">Inglés desde cero</h1>
          <p class="entradilla centrado" style="margin:0 auto 34px">Práctico, funcional y a tu ritmo. Primero, lo primero:</p>
          <label class="etiqueta" for="onb-nombre">¿Cómo te llamas?</label>
          <input class="respuesta-texto" id="onb-nombre" autocomplete="given-name" placeholder="Tu nombre" maxlength="30" value="${esc(borrador.nombre)}">
        </div>
        <div class="pie-accion"><button class="btn ancho acento" id="onb-sigue" ${borrador.nombre.trim().length >= 2 ? '' : 'disabled'}>Continuar</button></div>
      </div>`;
    const campo = $('#onb-nombre');
    const boton = $('#onb-sigue');
    campo.addEventListener('input', () => { boton.disabled = campo.value.trim().length < 2; });
    campo.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !boton.disabled) boton.click(); });
    boton.addEventListener('click', () => {
      borrador.nombre = campo.value.trim();
      vOnboarding(2, borrador);
    });
    campo.focus();
    return;
  }

  if (paso === 3) return vOnboardingMeta(borrador);

  // paso 2: el motivo
  vista().innerHTML = `
    <div class="onboarding">
      <div class="onb-paso"><div class="ej-barra"><i style="width:66%"></i></div></div>
      <h1>Hola, <span class="onb-nombre">${esc(borrador.nombre)}</span>: ¿para qué quieres aprender inglés?</h1>
      <p class="entradilla" style="margin-bottom:26px">Tu tutor personaliza la conversación y los ejemplos con esto.</p>
      <div class="quiz">
        ${MOTIVOS.map((m) => `<button class="quiz-carta ${borrador.motivo === m.id ? 'elegida' : ''}" data-motivo="${m.id}">
          <span class="quiz-icono">${(typeof STICKERS !== 'undefined' && STICKERS[m.id]) ? `<img src="img/${STICKERS[m.id]}" alt="">` : m.icono}</span>
          <span class="quiz-titulo">${esc(m.titulo)}</span>
          <span class="quiz-check">${ICO.check}</span>
        </button>`).join('')}
      </div>
      <div class="pie-accion"><button class="btn ancho acento" id="onb-listo" ${borrador.motivo ? '' : 'disabled'}>Empezar el curso</button></div>
    </div>`;

  vista().querySelectorAll('.quiz-carta').forEach((b) => {
    b.addEventListener('click', () => {
      borrador.motivo = b.dataset.motivo;
      vista().querySelectorAll('.quiz-carta').forEach((x) => x.classList.toggle('elegida', x === b));
      $('#onb-listo').disabled = false;
    });
  });
  $('#onb-listo').addEventListener('click', () => vOnboarding(3, borrador));
}

function vOnboardingMeta(borrador) {
  vista().innerHTML = `
    <div class="onboarding">
      <div class="onb-paso"><div class="ej-barra"><i style="width:100%"></i></div></div>
      <h1>Establece un objetivo de estudio diario</h1>
      <p class="entradilla" style="margin-bottom:26px">Crear el hábito importa más que la sesión larga. Puedes cambiarlo cuando quieras.</p>
      <div class="metas">
        ${METAS.map((m) => `<button class="meta-fila ${borrador.meta === m.min ? 'elegida' : ''}" data-meta="${m.min}">
          <span class="meta-min">${m.min} minutos/día</span>
          <span class="meta-nombre">${m.nombre}</span>
        </button>`).join('')}
      </div>
      <div class="pie-accion"><button class="btn ancho acento" id="onb-listo" ${borrador.meta ? '' : 'disabled'}>Empezar el curso</button></div>
    </div>`;
  vista().querySelectorAll('.meta-fila').forEach((b) => {
    b.addEventListener('click', () => {
      borrador.meta = +b.dataset.meta;
      vista().querySelectorAll('.meta-fila').forEach((x) => x.classList.toggle('elegida', x === b));
      $('#onb-listo').disabled = false;
    });
  });
  $('#onb-listo').addEventListener('click', () => {
    P.perfil = { nombre: borrador.nombre, motivo: borrador.motivo, meta: borrador.meta };
    guarda();
    vInicio();
  });
}

// Primera visita: el cuestionario antes que nada. (Este script carga después
// de app.js, así que pisa el vInicio() del arranque; el parpadeo no se ve.)
if (!P.perfil || !P.perfil.nombre) vOnboarding();
