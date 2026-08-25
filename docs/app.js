/* INGLES — el motor del curso.
   Vistas: curso (unidades) -> unidad (bloques) -> lecciones / práctica /
   examen / ensayo; y aparte: repaso espaciado, conversación con IA y perfil.

   El progreso vive en localStorage y, si hay pase, se sincroniza con el
   worker (gana el que tenga `mod` más nuevo). Sin pase todo funciona igual,
   solo que el progreso no viaja entre dispositivos. */

'use strict';

const API = 'https://ingles.studio-iris2026.workers.dev';
const CLAVE_LOCAL = 'ingles-progreso';
const CLAVE_TOKEN = 'ingles-token';
const CLAVE_AJUSTES = 'ingles-ajustes';

// Cajas del repaso espaciado: días hasta la próxima aparición.
const CAJAS_DIAS = [0, 1, 3, 7, 14, 30];
const NOTA_EXAMEN = 75;   // % para aprobar y desbloquear la siguiente unidad
const NOTA_DOMINIO = 85;  // % desde el que una lección se considera dominada
const TANDA_EXAMEN = 10;  // preguntas por examen

// ---- iconos (SVG de línea, estilo Lucide) ----------------------------------

const ICO = {
  fuego: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3 2.5.5 5 2.5 5 6a5 5 0 0 1-10 0c0-1.5.5-2.5 1-3.5.3 1.5 1 3 2.5 3z"/><path d="M14.5 9c.7-1.5.5-3.5-.5-5-1 2-2.5 2.6-4 4C8 9.5 7 11.5 7 13"/></svg>',
  estrella: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  ajustes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4m0 14v4M4.2 4.2l2.8 2.8m10 10 2.8 2.8M1 12h4m14 0h4M4.2 19.8l2.8-2.8m10-10 2.8-2.8"/></svg>',
  atras: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  altavoz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
  tortuga: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>',
  libro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  regla: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20M2 7h20M2 17h20" opacity="0"/><path d="M3 5h18v14H3z"/><path d="M7 5v4m4-4v4m4-4v4m-8 6h10"/></svg>',
  charla: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  pesa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5 17.5 17.5"/><path d="m21 21-1.5-1.5M3 3l1.5 1.5"/><path d="M18 22 22 18M2 6 6 2"/><path d="m3 10 7-7m4 18 7-7"/></svg>',
  diploma: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/></svg>',
  pluma: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2"/><path d="M12 19v3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  equis: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  refresco: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><path d="M21 3v5h-5"/></svg>',
  candado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
};

// ---- estado ----------------------------------------------------------------

let P = cargaProgreso();
let AJ = JSON.parse(localStorage.getItem(CLAVE_AJUSTES) || '{"lento":false}');
let token = localStorage.getItem(CLAVE_TOKEN) || '';
let guardadoPendiente = null;

function progresoVacio() {
  return { v: 1, xp: 0, racha: { dias: 0, ultimo: '' }, unidades: {}, srs: {}, mod: 0 };
}

function cargaProgreso() {
  try {
    const p = JSON.parse(localStorage.getItem(CLAVE_LOCAL));
    if (p && p.v === 1) return p;
  } catch (e) { /* corrupto: se empieza de cero */ }
  return progresoVacio();
}

function guarda() {
  P.mod = Date.now();
  localStorage.setItem(CLAVE_LOCAL, JSON.stringify(P));
  pintaBarra();
  if (!token) return;
  clearTimeout(guardadoPendiente);
  guardadoPendiente = setTimeout(subeProgreso, 2000);
}

async function subeProgreso() {
  if (!token) return;
  try {
    await fetch(API + '/progreso', {
      method: 'PUT',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(P)
    });
  } catch (e) { /* sin red: la próxima escritura reintenta */ }
}

async function bajaProgreso() {
  if (!token) return;
  try {
    const r = await fetch(API + '/progreso', { headers: { Authorization: 'Bearer ' + token } });
    if (r.status === 401) { token = ''; localStorage.removeItem(CLAVE_TOKEN); return; }
    if (!r.ok) return;
    const remoto = await r.json();
    if (remoto && remoto.v === 1 && (remoto.mod || 0) > (P.mod || 0)) {
      P = remoto;
      localStorage.setItem(CLAVE_LOCAL, JSON.stringify(P));
      pintaBarra();
      if (vistaActual === 'inicio') vInicio();
    }
  } catch (e) { /* sin red */ }
}

// Con pase, el texto dinámico (chat, ensayos) se dice con la voz neuronal del
// worker; sin él (o sin clave de Groq), Voz cae sola al sintetizador.
function conectaVozNube() {
  Voz.oido = !token ? null : async (blob) => {
    const r = await fetch(API + '/ia/oido', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': blob.type || 'audio/webm' },
      body: blob
    });
    if (!r.ok) return null;
    return (await r.json()).texto;
  };
  Voz.nube = !token ? null : async (texto) => {
    const r = await fetch(API + '/ia/voz', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto })
    });
    if (!r.ok) return null;
    return URL.createObjectURL(await r.blob());
  };
}

function u(uid) {
  if (!P.unidades[uid]) P.unidades[uid] = { lec: {}, practica: 0, examen: -1, ensayo: -1 };
  if (!P.unidades[uid].lecs) P.unidades[uid].lecs = {};
  if (!P.unidades[uid].notas) P.unidades[uid].notas = {};   // mejor nota por lección
  return P.unidades[uid];
}

// Fecha LOCAL, no UTC: con toISOString el "día" de la racha cambiaría a las
// 7 de la tarde (UTC-5), y una sesión nocturna contaría como el día siguiente.
function fechaISO(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function hoyISO() { return fechaISO(new Date()); }

function tocaRacha() {
  const hoy = hoyISO();
  if (P.racha.ultimo === hoy) return;
  const ayer = fechaISO(new Date(Date.now() - 86400000));
  P.racha.dias = P.racha.ultimo === ayer ? P.racha.dias + 1 : 1;
  P.racha.ultimo = hoy;
}

function daXP(n) { tocaRacha(); P.xp += n; guarda(); }

// ---- minutos de estudio reales ---------------------------------------------
// Cada 15 s, si la pestana tiene foco y estas ESTUDIANDO (no en la portada),
// se suman 15 s al dia. Alimenta el anillo del objetivo diario del perfil.
const VISTAS_DE_ESTUDIO = ['corredor', 'leccion', 'vocab', 'gram', 'dialogo', 'repaso', 'charla', 'ensayo'];
function segundosHoy() {
  if (!P.dias) P.dias = {};
  return P.dias[hoyISO()] || 0;
}
setInterval(() => {
  if (document.hidden) return;
  if (!VISTAS_DE_ESTUDIO.includes(vistaActual)) return;
  if (!P.dias) P.dias = {};
  P.dias[hoyISO()] = (P.dias[hoyISO()] || 0) + 15;
  // sin guarda() completo cada 15 s: se persiste barato y sin re-render
  P.mod = Date.now();
  localStorage.setItem(CLAVE_LOCAL, JSON.stringify(P));
}, 15000);

// ---- repaso espaciado -------------------------------------------------------

function claveSRS(uid, i) { return uid + ':' + i; }

function anotaSRS(uid, i, acierto) {
  const k = claveSRS(uid, i);
  const item = P.srs[k] || { caja: 0, prox: 0 };
  item.caja = acierto ? Math.min(item.caja + 1, CAJAS_DIAS.length - 1) : Math.max(item.caja - 1, 0);
  item.prox = Date.now() + CAJAS_DIAS[item.caja] * 86400000;
  P.srs[k] = item;
}

function pendientesSRS() {
  const ahora = Date.now();
  const lista = [];
  for (const [k, item] of Object.entries(P.srs)) {
    if (item.prox > ahora) continue;
    const [uid, i] = k.split(':');
    const unidad = CURSO.find((x) => x.id === uid);
    const palabra = unidad && unidad.vocab[+i];
    if (palabra) lista.push({ uid, i: +i, palabra, caja: item.caja });
  }
  // Primero las cajas bajas: son las que están más flojas.
  return lista.sort((a, b) => a.caja - b.caja);
}

// ---- utilidades de interfaz -------------------------------------------------

const $ = (sel) => document.querySelector(sel);
const vista = () => $('#vista');
let vistaActual = 'inicio';

// Primera letra en mayúscula respetando lo que ya viene capitalizado y sin
// tocar palabras en inglés que se escriben en minúscula por regla.
// {TU} en el contenido = el nombre que la persona eligio en el cuestionario.
// Si aun no hay nombre, se usa uno neutro para que la frase siga teniendo
// sentido.
function tuNombre() {
  return (P.perfil && P.perfil.nombre && P.perfil.nombre.trim()) || 'Alex';
}
function conNombre(t) {
  return String(t == null ? '' : t).split('{TU}').join(tuNombre());
}

// Copia del ejercicio con {TU} resuelto en todos sus textos. Se conserva el
// original en `_crudo` para que el repaso espaciado siga reconociendolo.
function resuelveNombre(ej) {
  if (!ej || typeof ej !== 'object') return ej;
  const bruto = JSON.stringify(ej);
  if (!bruto.includes('{TU}')) return ej;
  const copia = JSON.parse(bruto.split('{TU}').join(tuNombre()));
  copia._crudo = ej;
  return copia;
}

// Primera letra en mayuscula. Va en los terminos y frases que se leen SUELTOS
// (opciones de respuesta, parejas, la palabra de la tarjeta, los enunciados).
// NO va en lo que se lee dentro de una frase: las opciones de los ejercicios
// de completar ("I ___ Dosa" -> am) y las piezas de ordenar, donde una
// mayuscula a media frase seria un error de ingles.
// ---- elenco -----------------------------------------------------------------
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
}

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

function mayus(t) {
  const s = String(t);
  // La mayuscula va en la primera LETRA, no en el primer caracter: en
  // "¿como estas?" el primer caracter es el "¿" y la letra se quedaba abajo.
  const i = s.search(/\p{L}/u);
  if (i < 0) return s;
  return s.slice(0, i) + s.charAt(i).toUpperCase() + s.slice(i + 1);
}

function esc(t) {
  return conNombre(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Ilustraciones del vocabulario (docs/img/, generadas con Magnific). Si una
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

function botonAudio(texto, extra = '') {
  return `<button class="btn-audio ${extra}" data-di="${esc(texto)}" title="Escuchar" aria-label="Escuchar">${ICO.altavoz}</button>`;
}

// Un solo listener para todos los botones de audio de la página.
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-di]');
  if (!b) return;
  ev.stopPropagation();
  document.querySelectorAll('.sonando').forEach((x) => x.classList.remove('sonando'));
  b.classList.add('sonando');
  Voz.di(b.dataset.di, { lento: AJ.lento, alTerminar: () => b.classList.remove('sonando') });
});

function pintaBarra() {
  $('#dato-racha').innerHTML = ICO.fuego + ' ' + P.racha.dias;
  $('#dato-racha').classList.toggle('encendido', P.racha.ultimo === hoyISO());
  $('#dato-xp').innerHTML = ICO.estrella + ' ' + P.xp + ' pts';
  const nRepaso = pendientesSRS().length;
  const tabRepaso = document.querySelector('[data-vista="repaso"]');
  tabRepaso.innerHTML = nRepaso ? `Repaso <span class="pendiente">(${nRepaso})</span>` : 'Repaso';
}

// ---- navegación -------------------------------------------------------------

$('#tabs').addEventListener('click', (ev) => {
  const b = ev.target.closest('button');
  if (!b) return;
  document.querySelectorAll('#tabs button').forEach((x) => x.classList.toggle('activo', x === b));
  Voz.calla();
  ({ inicio: vInicio, repaso: vRepaso, charla: vCharla, perfil: vPerfil })[b.dataset.vista]();
});

$('#ir-inicio').addEventListener('click', () => {
  document.querySelectorAll('#tabs button').forEach((x) => x.classList.toggle('activo', x.dataset.vista === 'inicio'));
  Voz.calla();
  vInicio();
});

// ---- vista: curso (lista de unidades) --------------------------------------

function examenAprobado(uid) { return (P.unidades[uid]?.examen ?? -1) >= NOTA_EXAMEN; }

function desbloqueada(idx) {
  if (idx === 0) return true;
  return examenAprobado(CURSO[idx - 1].id);
}

// Anillo de avance: 26px, r=11 -> circunferencia 69,1.
function anilloSVG(pct) {
  const c = 69.1;
  return `<svg class="anillo" viewBox="0 0 26 26" aria-hidden="true">
    <circle class="pista" cx="13" cy="13" r="11"/>
    <circle class="valor" cx="13" cy="13" r="11" stroke-dasharray="${(c * pct / 100).toFixed(1)} ${c}"/>
  </svg>`;
}

function pctUnidad(unidad) {
  const d = u(unidad.id);
  if (unidad.lecciones) {
    const hechas = unidad.lecciones.filter((l) => d.lecs[l.id]).length + (examenAprobado(unidad.id) ? 1 : 0);
    return Math.round((hechas / (unidad.lecciones.length + 1)) * 100);
  }
  let hecho = 0, total = 4 + (unidad.dialogo ? 1 : 0);
  if (d.lec.vocab) hecho++;
  if (d.lec.gram) hecho++;
  if (unidad.dialogo && d.lec.dialogo) hecho++;
  if (d.practica >= unidad.ejercicios.length) hecho++;
  if (examenAprobado(unidad.id)) hecho++;
  return Math.round((hecho / total) * 100);
}

function vInicio() {
  vistaActual = 'inicio';
  const hechas = CURSO.filter((x) => examenAprobado(x.id)).length;
  const meta = (P.perfil && P.perfil.meta) || 10;
  const minHoy = Math.floor(segundosHoy() / 60);
  const pct = Math.min(1, segundosHoy() / (meta * 60));
  const C = 2 * Math.PI * 40;
  // la semana, de lunes a domingo, marcando los dias con estudio
  const nombresDia = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const lunes = new Date();
  lunes.setDate(lunes.getDate() - ((lunes.getDay() + 6) % 7));
  let semana = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(lunes); d.setDate(lunes.getDate() + i);
    const clave = fechaISO(d);
    const esHoy = clave === hoyISO();
    const cumplido = (P.dias && P.dias[clave] || 0) >= meta * 60 || (esHoy && pct >= 1);
    semana += `<span class="dia ${cumplido ? 'hecho' : ''} ${esHoy ? 'hoy' : ''}">${nombresDia[i]}</span>`;
  }
  const faltan = Math.max(0, meta - minHoy);
  let html = `<span class="etiqueta">Nivel A0 &ndash; A1</span>
    <h1>${P.perfil && P.perfil.nombre ? 'Hola, ' + esc(P.perfil.nombre) : 'Inglés desde cero'}</h1>
    <p class="entradilla">${P.racha.dias > 1 ? 'Sigue así: llevas ' + P.racha.dias + ' días seguidos.' : 'Doce unidades. Cada una se abre aprobando el examen de la anterior.'}</p>
    <svg width="0" height="0" style="position:absolute"><defs><linearGradient id="grad-anillo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3ad8f0"/><stop offset="1" stop-color="#1266cc"/></linearGradient></defs></svg>
    <div class="meta-dia">
      <div class="anillo-meta">
        <svg viewBox="0 0 92 92">${pct > 0 ? `<circle class="valor" cx="46" cy="46" r="40" stroke-dasharray="${(C * pct).toFixed(1)} ${C.toFixed(1)}"/>` : ''}</svg>
        <span class="anillo-centro">${minHoy}<small>de ${meta} min</small></span>
      </div>
      <div class="meta-info">
        <b>Objetivo de hoy</b>
        <span>${pct >= 1 ? 'Cumplido. Todo lo demás es propina.' : (faltan + (faltan === 1 ? ' minuto más' : ' minutos más') + ' y aseguras el día')}</span>
        <div class="dias-semana">${semana}</div>
      </div>
    </div>
    <div class="tarjetas-stats">
      <div class="stat"><div class="stat-num">${hechas}<span class="cifra-chica" style="-webkit-text-fill-color:inherit">/${CURSO.length}</span></div><div class="stat-nombre">unidades</div></div>
      <div class="stat"><div class="stat-num oro">${P.racha.dias}</div><div class="stat-nombre">racha</div></div>
      <div class="stat"><div class="stat-num azul">${P.xp}</div><div class="stat-nombre">puntos</div></div>
    </div>
    <div class="unidades">`;
  CURSO.forEach((unidad, idx) => {
    const abierta = desbloqueada(idx);
    const pct = pctUnidad(unidad);
    const hecha = examenAprobado(unidad.id);
    const actual = abierta && !hecha;
    html += `<button class="unidad ${abierta ? '' : 'bloqueada'} ${hecha ? 'hecha' : ''} ${actual ? 'actual' : ''}" data-uid="${unidad.id}" ${abierta ? '' : 'disabled'}>
      <span class="unidad-num">${hecha ? ICO.check : String(idx + 1).padStart(2, '0')}</span>
      <span class="unidad-info">
        <span class="unidad-titulo">${esc(unidad.titulo)}</span>
        <span class="unidad-sub">${esc(unidad.descripcion)}</span>
      </span>
      <span class="unidad-cola">
        ${abierta ? (pct > 0 && pct < 100 ? anilloSVG(pct) : '') : ICO.candado.replace('<svg', '<svg class="candado"')}
        <span class="nivel">${unidad.nivel}</span>
      </span>
    </button>`;
  });
  html += '</div>';
  vista().innerHTML = html;
  vista().querySelectorAll('.unidad[data-uid]').forEach((b) => {
    b.addEventListener('click', () => vUnidad(b.dataset.uid));
  });
  pintaBarra();
}

// ---- vista: unidad ----------------------------------------------------------

function vUnidad(uid) {
  vistaActual = 'unidad';
  const unidad = CURSO.find((x) => x.id === uid);
  if (unidad.lecciones) return vUnidadNueva(unidad);
  const d = u(uid);
  const practicaHecha = d.practica >= unidad.ejercicios.length;
  const leccionesListas = d.lec.vocab && d.lec.gram && (!unidad.dialogo || d.lec.dialogo);

  const bloque = (icono, titulo, sub, extra, clases, accion) =>
    `<button class="bloque ${clases}" data-accion="${accion}">
      <span class="bloque-icono">${icono}</span>
      <span><span class="bloque-titulo">${titulo}</span><br><span class="bloque-sub">${sub}</span></span>
      ${extra}
    </button>`;

  vista().innerHTML = `
    <button class="volver" id="volver">${ICO.atras} Todas las unidades</button>
    <h1>${esc(unidad.titulo)}</h1>
    <p class="gris">${esc(unidad.descripcion)}</p>
    <div class="bloques">
      ${bloque(ICO.libro, 'Vocabulario', unidad.vocab.length + ' palabras con audio', d.lec.vocab ? `<span class="bloque-extra bien">${ICO.check}</span>` : '', d.lec.vocab ? 'hecho' : '', 'vocab')}
      ${bloque(ICO.regla, 'Gramática', 'La explicación, con ejemplos para escuchar', d.lec.gram ? `<span class="bloque-extra bien">${ICO.check}</span>` : '', d.lec.gram ? 'hecho' : '', 'gram')}
      ${unidad.dialogo ? bloque(ICO.charla, 'Diálogo', esc(unidad.dialogo.titulo), d.lec.dialogo ? `<span class="bloque-extra bien">${ICO.check}</span>` : '', d.lec.dialogo ? 'hecho' : '', 'dialogo') : ''}
      ${bloque(ICO.pesa, 'Práctica', unidad.ejercicios.length + ' ejercicios variados', `<span class="bloque-extra ${practicaHecha ? 'bien' : ''}">${Math.min(d.practica, unidad.ejercicios.length)}/${unidad.ejercicios.length}</span>`, practicaHecha ? 'hecho' : '', 'practica')}
      ${bloque(ICO.diploma, 'Examen', `${TANDA_EXAMEN} preguntas. Aprueba con ${NOTA_EXAMEN}% para abrir la siguiente unidad`, d.examen >= 0 ? `<span class="bloque-extra ${d.examen >= NOTA_EXAMEN ? 'bien' : ''}">${d.examen}%</span>` : '', (d.examen >= NOTA_EXAMEN ? 'hecho ' : '') + (leccionesListas ? '' : 'cerrado'), leccionesListas ? 'examen' : '')}
      ${bloque(ICO.pluma, 'Ensayo', esc(unidad.ensayo.resumen), d.ensayo >= 0 ? `<span class="bloque-extra ${d.ensayo >= 60 ? 'bien' : ''}">${d.ensayo}</span>` : '', '', 'ensayo')}
    </div>
    ${leccionesListas ? '' : `<p class="gris chica espacio-arriba" style="margin-top:14px">El examen se abre al terminar las lecciones de arriba.</p>`}`;

  $('#volver').addEventListener('click', vInicio);
  vista().querySelectorAll('[data-accion]').forEach((b) => {
    const a = b.dataset.accion;
    if (!a) return;
    b.addEventListener('click', () => {
      Voz.calla();
      if (a === 'vocab') vVocab(unidad);
      else if (a === 'gram') vGramatica(unidad);
      else if (a === 'dialogo') vDialogo(unidad);
      else if (a === 'practica') empiezaPractica(unidad);
      else if (a === 'examen') empiezaExamen(unidad);
      else if (a === 'ensayo') vEnsayo(unidad);
    });
  });
}

// ---- lecciones --------------------------------------------------------------

function vVocab(unidad) {
  vistaActual = 'vocab';
  let filas = '';
  unidad.vocab.forEach((v) => {
    filas += `<div class="vocab">
      ${imagenDe(v.en)}
      <span class="vocab-txt">
        <span class="vocab-en">${esc(mayus(v.en))}</span> <span class="vocab-es">${esc(v.es)}</span>
        ${v.ej ? `<span class="vocab-ej">${esc(v.ej)}</span>` : ''}
      </span>
      ${botonAudio(v.en)}
    </div>`;
  });
  vista().innerHTML = `
    <button class="volver" id="volver">${ICO.atras} ${esc(unidad.titulo)}</button>
    <span class="etiqueta">Unidad ${esc(unidad.titulo)}</span>
    <h1>Vocabulario</h1>
    <p class="entradilla">${unidad.vocab.length} palabras. Toca el altavoz para escucharlas; la práctica y el repaso se encargan del resto.</p>
    <div class="espacio"></div>
    <div class="ficha"><div class="vocab-lista">${filas}</div></div>
    <button class="btn ancho" id="listo">Ya las escuché todas</button>`;
  $('#volver').addEventListener('click', () => vUnidad(unidad.id));
  $('#listo').addEventListener('click', () => {
    const d = u(unidad.id);
    if (!d.lec.vocab) { d.lec.vocab = 1; daXP(15); } else guarda();
    vUnidad(unidad.id);
  });
}

function vGramatica(unidad) {
  vistaActual = 'gram';
  let bloques = '';
  unidad.gramatica.forEach((g) => {
    bloques += `<div class="ficha gram"><h2 style="margin-top:0">${esc(g.titulo)}</h2>${g.html}</div>`;
  });
  vista().innerHTML = `
    <button class="volver" id="volver">${ICO.atras} ${esc(unidad.titulo)}</button>
    <h1>Gramática</h1>
    ${bloques}
    <button class="btn ancho" id="listo">Entendido</button>`;
  // Las frases de ejemplo marcadas con .ej se escuchan al tocarlas.
  vista().querySelectorAll('.ej').forEach((n) => {
    n.style.cursor = 'pointer';
    n.title = 'Escuchar';
    n.addEventListener('click', () => Voz.di(n.textContent, { lento: AJ.lento }));
  });
  $('#volver').addEventListener('click', () => vUnidad(unidad.id));
  $('#listo').addEventListener('click', () => {
    const d = u(unidad.id);
    if (!d.lec.gram) { d.lec.gram = 1; daXP(15); } else guarda();
    vUnidad(unidad.id);
  });
}

function vDialogo(unidad) {
  vistaActual = 'dialogo';
  const dlg = unidad.dialogo;
  let lineas = '';
  dlg.lineas.forEach((l, i) => {
    lineas += `<div class="linea ${l.q === 'B' ? 'b' : ''}">
      <span class="linea-quien">${esc(l.q)}</span>
      <div class="globo" data-idx="${i}">${esc(l.en)}<span class="globo-es">${esc(l.es)}</span></div>
    </div>`;
  });
  vista().innerHTML = `
    <button class="volver" id="volver">${ICO.atras} ${esc(unidad.titulo)}</button>
    <h1>${esc(dlg.titulo)}</h1>
    <p class="gris">Escucha el diálogo completo o toca cada globo. Cuando lo sigas sin leer la traducción, responde las preguntas.</p>
    <div class="acciones" style="margin:0 0 16px">
      <button class="btn secundario" id="reproducir">${ICO.altavoz} Reproducir todo</button>
    </div>
    <div class="ficha"><div class="dialogo">${lineas}</div></div>
    <button class="btn ancho" id="preguntas">Responder las preguntas</button>`;

  $('#volver').addEventListener('click', () => vUnidad(unidad.id));

  vista().querySelectorAll('.globo').forEach((g) => {
    g.addEventListener('click', () => {
      const l = dlg.lineas[+g.dataset.idx];
      document.querySelectorAll('.globo.sonando').forEach((x) => x.classList.remove('sonando'));
      g.classList.add('sonando');
      Voz.di(l.en, { lento: AJ.lento, voz: l.q === 'B' ? 'b' : 'a', alTerminar: () => g.classList.remove('sonando') });
    });
  });

  let tocando = false;
  $('#reproducir').addEventListener('click', () => {
    if (tocando) { tocando = false; Voz.calla(); return; }
    tocando = true;
    const globos = vista().querySelectorAll('.globo');
    const toca = (i) => {
      if (!tocando || i >= dlg.lineas.length) { tocando = false; return; }
      const l = dlg.lineas[i];
      globos.forEach((x) => x.classList.remove('sonando'));
      globos[i].classList.add('sonando');
      globos[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      Voz.di(l.en, { lento: AJ.lento, voz: l.q === 'B' ? 'b' : 'a', alTerminar: () => setTimeout(() => toca(i + 1), 350) });
    };
    toca(0);
  });

  $('#preguntas').addEventListener('click', () => {
    tocando = false; Voz.calla();
    corredor({
      titulo: 'Preguntas del diálogo',
      ejercicios: dlg.preguntas,
      repetirFallos: true,
      alTerminar: (aciertos, total) => {
        const d = u(unidad.id);
        if (!d.lec.dialogo && aciertos === total) { d.lec.dialogo = 1; daXP(20); } else guarda();
        resumenTanda(aciertos, total, aciertos === total ? 'Diálogo dominado.' : 'Casi: vuelve a escucharlo y reintenta las preguntas.', () => vUnidad(unidad.id));
      }
    });
  });
}

// ---- ensayo -----------------------------------------------------------------

function vEnsayo(unidad) {
  vistaActual = 'ensayo';
  const e = unidad.ensayo;
  vista().innerHTML = `
    <button class="volver" id="volver">${ICO.atras} ${esc(unidad.titulo)}</button>
    <h1>Ensayo</h1>
    <div class="ficha">
      <p><b>Consigna:</b> ${esc(e.consigna)}</p>
      <p class="gris chica" style="margin-top:6px">Mínimo ${e.min} palabras, en inglés. La IA lo corrige, lo puntúa y te da la versión mejorada.</p>
    </div>
    <textarea class="ensayo-area" id="texto" placeholder="Write here, in English..." spellcheck="false"></textarea>
    <p class="gris chica" id="cuenta" style="margin-top:6px">0 palabras</p>
    <div class="acciones">
      <button class="btn acento" id="enviar" disabled>Enviar a corregir</button>
    </div>
    <div id="resultado"></div>`;

  $('#volver').addEventListener('click', () => vUnidad(unidad.id));
  const area = $('#texto');
  const nPalabras = () => area.value.trim().split(/\s+/).filter(Boolean).length;
  area.addEventListener('input', () => {
    const n = nPalabras();
    $('#cuenta').textContent = n + ' palabras' + (n < e.min ? ' (mínimo ' + e.min + ')' : '');
    $('#enviar').disabled = n < e.min;
  });

  $('#enviar').addEventListener('click', async () => {
    if (!token) { modalPase(() => vEnsayo(unidad)); return; }
    $('#enviar').disabled = true;
    $('#enviar').textContent = 'Corrigiendo...';
    try {
      const r = await fetch(API + '/ia/ensayo', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ consigna: e.consigna, texto: area.value, nivel: unidad.nivel, nombre: P.perfil && P.perfil.nombre, motivo: P.perfil && etiquetaMotivo(P.perfil.motivo) })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || ('fallo ' + r.status));
      pintaCorreccion(unidad, data);
    } catch (err) {
      $('#resultado').innerHTML = `<div class="aviso">No se pudo corregir: ${esc(err.message)}.
        ${String(err.message).includes('clave') ? 'Falta configurar la clave de Groq en el worker.' : 'Revisa la conexión e intenta de nuevo.'}</div>`;
      $('#enviar').disabled = false;
      $('#enviar').textContent = 'Enviar a corregir';
    }
  });
}

function pintaCorreccion(unidad, c) {
  const d = u(unidad.id);
  if (c.puntaje > (d.ensayo ?? -1)) d.ensayo = c.puntaje;
  daXP(Math.round(c.puntaje / 2));

  const clase = c.puntaje >= 75 ? 'verde' : (c.puntaje < 50 ? 'rojo' : 'azul');
  let items = '';
  (c.correcciones || []).forEach((x) => {
    items += `<div class="corr-item">
      <span class="tachado">${esc(x.original)}</span><span class="flecha">&rarr;</span><span class="bueno">${esc(x.corregido)}</span>
      <span class="porque">${esc(x.explicacion)}</span>
    </div>`;
  });
  $('#resultado').innerHTML = `
    <div class="espacio"></div>
    <div class="ficha">
      <span class="etiqueta">Tu puntaje</span>
      <div class="puntaje-grande ${clase}">${c.puntaje}<span class="gris" style="font-size:.4em">/100</span></div>
      <p class="entradilla">${esc(c.resumen || '')}</p>
    </div>
    ${items ? `<h2>Correcciones</h2><div class="correccion">${items}</div>` : ''}
    ${c.version_mejorada ? `<h2>Versión mejorada ${botonAudio(c.version_mejorada)}</h2><div class="ficha">${esc(c.version_mejorada)}</div>` : ''}
    ${c.consejo ? `<div class="aviso">${esc(c.consejo)}</div>` : ''}
    <button class="btn ancho" id="volver-unidad">Listo</button>`;
  $('#volver-unidad').addEventListener('click', () => vUnidad(unidad.id));
  $('#resultado').scrollIntoView({ behavior: 'smooth' });
}

// ---- corredor de ejercicios -------------------------------------------------
// Recorre una lista de ejercicios de cualquier tipo, pinta el veredicto y, si
// se pide, repite al final los que salieron mal (una vez).

// El error no regaña: invita a reintentar. Se elige uno al azar para que no
// canse la repetición (petición de Dosa: "que le den ganas de mejorar").
const ANIMOS_FALLO = [
  'Casi', 'Vuelve a intentarlo', 'Ya casi lo tienes', 'Por poco',
  'Se aprende así', 'Otra vez y sale'
];
const ANIMOS_ACIERTO = ['Correcto', 'Muy bien', 'Perfecto', 'Eso es', 'Excelente'];
const alAzar = (lista) => lista[Math.floor(Math.random() * lista.length)];

function baraja(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function empiezaPractica(unidad) {
  corredor({
    titulo: 'Práctica',
    ejercicios: baraja(unidad.ejercicios),
    repetirFallos: true,
    alAcierto: (ej, primerIntento) => {
      daXP(primerIntento ? 10 : 5);
      if (ej.vocabIdx != null) anotaSRS(unidad.id, ej.vocabIdx, primerIntento);
    },
    alFallo: (ej) => { if (ej.vocabIdx != null) anotaSRS(unidad.id, ej.vocabIdx, false); },
    alTerminar: (aciertos, total) => {
      const d = u(unidad.id);
      d.practica = Math.max(d.practica, aciertos === total ? unidad.ejercicios.length : aciertos);
      guarda();
      resumenTanda(aciertos, total,
        aciertos === total ? 'Práctica completa. El vocabulario que fallaste entró al repaso.' : 'Los fallos vuelven a aparecer en el repaso. Puedes repetir la práctica cuando quieras.',
        () => vUnidad(unidad.id));
    }
  });
}

function empiezaExamen(unidad) {
  const preguntas = baraja(unidad.examen).slice(0, TANDA_EXAMEN);
  corredor({
    titulo: 'Examen',
    ejercicios: preguntas,
    repetirFallos: false,
    alTerminar: (aciertos, total) => {
      const nota = Math.round((aciertos / total) * 100);
      const d = u(unidad.id);
      const primeraVez = d.examen < NOTA_EXAMEN && nota >= NOTA_EXAMEN;
      if (nota > d.examen) d.examen = nota;
      daXP(primeraVez ? 50 + Math.round(nota / 2) : Math.round(nota / 4));
      const idx = CURSO.findIndex((x) => x.id === unidad.id);
      const hay = idx + 1 < CURSO.length;
      resumenTanda(aciertos, total,
        nota >= NOTA_EXAMEN
          ? (hay ? `Aprobado con ${nota}%. Se abrió la unidad ${idx + 2}.` : `Aprobado con ${nota}%. Terminaste todas las unidades del curso.`)
          : `${nota}%. Hace falta ${NOTA_EXAMEN}%: repasa la práctica y vuelve a intentarlo.`,
        () => vUnidad(unidad.id));
    }
  });
}

function corredor({ titulo, ejercicios, repetirFallos, alAcierto, alFallo, alTerminar }) {
  vistaActual = 'corredor';
  const cola = ejercicios.slice();
  const totalPlan = cola.length;          // los ejercicios distintos de la tanda
  let hechos = 0, aciertos = 0;           // aciertos A LA PRIMERA (para la nota)
  let respondidas = 0;                    // todo lo respondido, repeticiones incluidas
  const yaRepetido = new Set();
  let micActivo = null;

  // Lo que queda por delante: lo hecho + la actual + la cola (que crece cuando
  // se repite un fallo). Antes el contador decia 10/10 y seguian saliendo
  // preguntas, que es justo lo que Dosa vio.
  const totalReal = () => hechos + (cola.length ? cola.length : 0) + 1;

  function siguiente() {
    Voz.calla();
    if (micActivo) { try { micActivo.abort(); } catch (e) {} micActivo = null; }
    if (!cola.length) { alTerminar(aciertos, totalPlan, respondidas); return; }
    pinta(cola.shift());
  }

  function cabecera() {
    const total = Math.max(totalPlan, totalReal());
    const repes = total - totalPlan;
    return `<div class="ej-cabecera">
      <button class="volver" id="salir" style="margin:0" title="Salir">${ICO.atras}</button>
      <div class="ej-barra"><i style="width:${Math.round((hechos / total) * 100)}%"></i></div>
      <span class="ej-contador">${hechos + 1}/${total}${repes ? `<b class="ej-repes" title="Repasos de lo que falló">+${repes}</b>` : ''}</span>
    </div>`;
  }

  function resuelve(ejPintado, ok, detalle) {
    const ej = ejPintado._crudo || ejPintado;
    if (ejPintado.pista) detalle.pista = ejPintado.pista;
    if (ejPintado.por) detalle.por = ejPintado.por;   // el porque de la respuesta
    const esRepe = yaRepetido.has(ej);
    hechos++;   // sin tope: si hay repasos, la tanda es mas larga y se dice
    const xpAntes = P.xp;
    respondidas++;
    if (ok) {
      if (!esRepe) aciertos++;   // la nota mide el acierto A LA PRIMERA
      if (alAcierto) alAcierto(ej, !esRepe);
    } else {
      if (alFallo) alFallo(ej);
      if (repetirFallos && !esRepe) { yaRepetido.add(ej); cola.push(ej); }
    }
    detalle.pts = P.xp - xpAntes;
    tocaRacha(); guarda();
    veredicto(ok, detalle, siguiente);
  }

  function pinta(ejCrudo) {
    // {TU} se resuelve aqui, una vez, sobre una copia: asi el enunciado, las
    // opciones, el audio, las piezas de ordenar y la respuesta esperada llevan
    // todos el nombre real de la persona.
    const ej = resuelveNombre(ejCrudo);
    const tipo = ej.tipo;
    // La ficha de fase situa al alumno: entender no es lo mismo que producir.
    const FASES = { entiende: '¿Entendiste la escena?', practica: 'Practica', produce: 'Ahora tú' };
    const chipFase = ej.fase && FASES[ej.fase]
      ? `<span class="fase-chip f-${ej.fase}">${FASES[ej.fase]}</span>` : '';
    let cuerpo = '';
    const consignas = {
      opcion: 'Elige la respuesta correcta',
      huecos: 'Completa la frase',
      traduce: 'Escribe en inglés',
      escucha: 'Escucha y escribe lo que oigas',
      ordena: 'Ordena las palabras',
      habla: 'Di la frase en voz alta',
      parejas: 'Une cada palabra con su traducción'
    };

    if (tipo === 'opcion' || tipo === 'huecos') {
      const enun = tipo === 'huecos' ? esc(ej.antes) + ' ____ ' + esc(ej.despues || '') : esc(ej.q);
      cuerpo = `<p class="consigna">${consignas[tipo]}</p>
        ${ej.audio ? ilustracionGrande(ej.audio) : ''}
        <p class="enunciado">${ej.audio ? botonAudio(ej.audio) : ''}${enun}</p>
        <div class="opciones">${ej.opciones.map((o, i) => `<button class="opcion" data-i="${i}">${esc(tipo === 'huecos' ? o : mayus(o))}</button>`).join('')}</div>`;
    } else if (tipo === 'traduce') {
      cuerpo = `<p class="consigna">${consignas.traduce}</p>
        ${ilustracionGrande(ej.en[0])}
        <p class="enunciado">${esc(mayus(ej.es))}</p>
        <input class="respuesta-texto" id="resp" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="In English...">
        <div class="pie-accion"><button class="btn ancho acento" id="comprobar">Comprobar</button></div>`;
    } else if (tipo === 'escucha') {
      cuerpo = `<p class="consigna">${consignas.escucha}</p>
        <p class="enunciado">${botonAudio(ej.en)}<button class="btn-audio" data-di-lento="${esc(ej.en)}" title="Más despacio">${ICO.tortuga}</button></p>
        <input class="respuesta-texto" id="resp" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type what you hear...">
        <div class="pie-accion"><button class="btn ancho acento" id="comprobar">Comprobar</button></div>`;
    } else if (tipo === 'ordena') {
      const piezas = baraja(ej.en.split(' ').concat(ej.extra || []));
      cuerpo = `<p class="consigna">${consignas.ordena}</p>
        <p class="enunciado gris" style="font-size:17px">${esc(mayus(ej.es))}</p>
        <div class="armado-cab">
          <span class="armado-guia" id="armado-guia">Toca las palabras en orden</span>
          <button class="btn-reinicia" id="reinicia" hidden>${ICO.refresco} Reiniciar</button>
        </div>
        <div class="armado" id="armado"></div>
        <div class="banco" id="banco">${piezas.map((p, i) => `<button class="pieza" data-p="${esc(p)}" data-i="${i}">${esc(p)}</button>`).join('')}</div>
        <div class="pie-accion"><button class="btn ancho acento" id="comprobar" disabled>Comprobar</button></div>`;
    } else if (tipo === 'habla') {
      cuerpo = `<p class="consigna">${consignas.habla}</p>
        <p class="hablar-frase">${botonAudio(ej.en)} ${esc(ej.en)}</p>
        <p class="hablar-fon gris">${esc(mayus(ej.es))}</p>
        <button class="btn-mic" id="mic">${ICO.mic} Toca y habla</button>
        <div class="oido" id="oido"></div>
        <div class="pie-accion"><button class="btn ancho secundario" id="saltar">No puedo hablar ahora</button></div>`;
    } else if (tipo === 'parejas') {
      const izquierda = ej.pares.map((p, i) => ({ t: p[0], par: i, lado: 'a' }));
      const derecha = baraja(ej.pares.map((p, i) => ({ t: p[1], par: i, lado: 'b' })));
      const mezcla = [];
      for (let i = 0; i < izquierda.length; i++) { mezcla.push(izquierda[i], derecha[i]); }
      cuerpo = `<p class="consigna">${consignas.parejas}</p>
        <div class="parejas">${mezcla.map((c) => `<button class="pareja" data-par="${c.par}" data-lado="${c.lado}" data-en="${esc(c.t)}">${esc(mayus(c.t))}</button>`).join('')}</div>`;
    }

    vista().innerHTML = cabecera() + chipFase + cuerpo;
    $('#salir').addEventListener('click', () => { Voz.calla(); vInicio(); });

    // audio lento del dictado
    const lentoBtn = vista().querySelector('[data-di-lento]');
    if (lentoBtn) lentoBtn.addEventListener('click', () => Voz.di(lentoBtn.dataset.diLento, { lento: true }));

    // dictado: sonar solo al entrar
    if (tipo === 'escucha') setTimeout(() => Voz.di(ej.en, { lento: AJ.lento }), 250);

    if (tipo === 'opcion' || tipo === 'huecos') {
      vista().querySelectorAll('.opcion').forEach((b) => b.addEventListener('click', () => {
        const i = +b.dataset.i;
        const ok = i === ej.r;
        vista().querySelectorAll('.opcion').forEach((x) => { x.disabled = true; });
        b.classList.add(ok ? 'ok' : 'no');
        if (!ok) vista().querySelectorAll('.opcion')[ej.r].classList.add('ok');
        const correcta = ej.opciones[ej.r];
        // OJO: en 'huecos' el enunciado suele llevar el contexto en ESPAÑOL
        // ("Son las 4 de la tarde: Good ___"). Mandar eso a la voz inglesa
        // sonaba fatal (lo pilló Dosa). Solo se dice la palabra, salvo que el
        // ejercicio traiga un `di` explícito en inglés.
        const dicho = ej.di || (tipo === 'huecos' ? correcta : null);
        resuelve(ej, ok, { correcta, di: dicho });
      }));
    }

    if (tipo === 'traduce' || tipo === 'escucha') {
      const comprueba = () => {
        const dado = $('#resp').value;
        if (!dado.trim()) return;
        const esperados = tipo === 'escucha' ? [ej.en] : ej.en;
        const ok = esperados.some((v) => Voz.normaliza(v) === Voz.normaliza(dado));
        resuelve(ej, ok, { correcta: esperados[0], di: esperados[0] });
      };
      $('#comprobar').addEventListener('click', comprueba);
      $('#resp').addEventListener('keydown', (e) => { if (e.key === 'Enter') comprueba(); });
      $('#resp').focus();
    }

    if (tipo === 'ordena') {
      const armado = $('#armado');
      const reinicia = $('#reinicia');
      const actualiza = () => {
        const hay = armado.children.length;
        $('#comprobar').disabled = !hay;
        reinicia.hidden = !hay;
        $('#armado-guia').hidden = !!hay;
      };
      reinicia.addEventListener('click', () => {
        armado.innerHTML = '';
        $('#banco').querySelectorAll('.pieza.usada').forEach((x) => x.classList.remove('usada'));
        actualiza();
      });
      $('#banco').addEventListener('click', (e) => {
        const p = e.target.closest('.pieza');
        if (!p || p.classList.contains('usada')) return;
        p.classList.add('usada');
        const copia = document.createElement('button');
        copia.className = 'pieza';
        copia.textContent = p.dataset.p;
        copia.dataset.origen = p.dataset.i;
        copia.addEventListener('click', () => {
          $('#banco').querySelector(`[data-i="${copia.dataset.origen}"]`).classList.remove('usada');
          copia.remove();
          actualiza();
        });
        armado.appendChild(copia);
        actualiza();
      });
      $('#comprobar').addEventListener('click', () => {
        const dado = Array.from(armado.children).map((x) => x.textContent).join(' ');
        const ok = Voz.normaliza(dado) === Voz.normaliza(ej.en);
        resuelve(ej, ok, { correcta: ej.en, di: ej.en });
      });
    }

    if (tipo === 'habla') {
      const btn = $('#mic');
      btn.addEventListener('click', () => {
        if (micActivo) { try { micActivo.stop(); } catch (e) {} return; }
        btn.classList.add('grabando');
        btn.innerHTML = ICO.mic + ' Escuchando... para solo cuando termines de hablar';
        $('#oido').innerHTML = '';
        micActivo = Voz.escucha({
          alOir: (alternativas) => {
            const notas = alternativas.map((t) => ({ t, n: Voz.notaPronunciacion(ej.en, t) }));
            notas.sort((a, b) => b.n - a.n);
            const mejor = notas[0];
            const ok = mejor.n >= 75;
            $('#oido').innerHTML = `Se oyó: <b class="${ok ? 'ok' : 'no'}">&quot;${esc(mejor.t)}&quot;</b> — pronunciación ${mejor.n}%`;
            setTimeout(() => resuelve(ej, ok, {
              correcta: ej.en, di: ej.en,
              nota: ok ? `Pronunciación ${mejor.n}%` : `Pronunciación ${mejor.n}%: escucha el modelo y prueba otra vez en el repaso`
            }), 900);
          },
          alError: (msj) => { $('#oido').innerHTML = `<span class="gris">${esc(msj)}</span>`; },
          alFin: () => {
            micActivo = null;
            btn.classList.remove('grabando');
            btn.innerHTML = ICO.mic + ' Toca y habla';
          }
        });
      });
      $('#saltar').addEventListener('click', () => resuelve(ej, true, { correcta: ej.en, di: ej.en, nota: 'Saltado sin micrófono' }));
    }

    if (tipo === 'parejas') {
      let elegida = null;
      let vivas = ej.pares.length;
      let fallos = 0;
      vista().querySelectorAll('.pareja').forEach((b) => b.addEventListener('click', () => {
        if (b.classList.contains('ok')) return;
        if (!elegida) { elegida = b; b.classList.add('elegida'); return; }
        if (elegida === b) { b.classList.remove('elegida'); elegida = null; return; }
        if (elegida.dataset.par === b.dataset.par && elegida.dataset.lado !== b.dataset.lado) {
          elegida.classList.remove('elegida');
          elegida.classList.add('ok'); b.classList.add('ok');
          // data-en: el texto tal cual esta en el curso. El de pantalla va
          // capitalizado y no casa con la clave del manifiesto de audio.
          const lado = elegida.dataset.lado === 'a' ? elegida : b;
          Voz.di(lado.dataset.en, { lento: false });
          vivas--;
          if (!vivas) resuelve(ej, fallos <= 1, { correcta: 'Parejas unidas con ' + fallos + ' ' + (fallos === 1 ? 'fallo' : 'fallos') });
        } else {
          fallos++;
          b.classList.add('no'); elegida.classList.add('no');
          const a = elegida;
          setTimeout(() => { a.classList.remove('no', 'elegida'); b.classList.remove('no'); }, 350);
        }
        elegida = null;
      }));
    }
  }

  function veredicto(ok, detalle, continuar) {
    const capa = document.createElement('div');
    capa.className = 'veredicto ' + (ok ? 'ok' : 'no');
    capa.innerHTML = `<div class="veredicto-inner">
      <div class="veredicto-cara">${ok ? ICO.check : ICO.equis}</div>
      <div class="veredicto-texto">
        <div class="veredicto-titulo">${ok ? alAzar(ANIMOS_ACIERTO) : alAzar(ANIMOS_FALLO)}</div>
        ${detalle.nota ? `<div class="veredicto-detalle">${esc(detalle.nota)}</div>` : ''}
        ${(!ok || detalle.di) ? `<div class="veredicto-detalle">${ok ? '' : '<span class="vd-resp">La correcta era:</span> <b>' + esc(detalle.correcta) + '</b>'}${detalle.di ? ' ' + botonAudio(detalle.di) : ''}</div>` : ''}
        ${detalle.por ? `<div class="veredicto-por">${conNombre(detalle.por)}</div>` : ''}
        ${detalle.pista ? `<div class="veredicto-pista">${esc(detalle.pista)}</div>` : ''}
      </div>
      <div class="veredicto-acciones">
        ${detalle.pts > 0 ? `<span class="vd-pts">+${detalle.pts} pts</span>` : ''}
        <button class="btn ${ok ? 'acento' : 'mal'}" id="sigue">Seguir</button>
      </div>
    </div>`;
    if (navigator.vibrate) { try { navigator.vibrate(ok ? 12 : [40, 50, 40]); } catch (e) {} }
    document.body.appendChild(capa);
    // Reflow forzado en vez de requestAnimationFrame: rAF no dispara en una
    // pestana de fondo y el veredicto se quedaba fuera de pantalla hasta que
    // la pestana recuperaba el foco.
    void capa.offsetHeight;
    capa.classList.add('visible');
    document.body.classList.add('con-veredicto');
    if (ok && detalle.di) Voz.di(detalle.di, { lento: false });
    // El Enter que disparo el veredicto SIGUE burbujeando hasta document, y
    // este listener nace en mitad de ese viaje: sin la guarda, ese mismo Enter
    // cerraba el veredicto antes de que se llegara a leer.
    const nacido = performance.now();
    const cierra = () => {
      capa.remove();
      document.body.classList.remove('con-veredicto');
      document.removeEventListener('keydown', porTecla);
      continuar();
    };
    const porTecla = (e) => { if (e.key === 'Enter' && e.timeStamp > nacido) cierra(); };
    capa.querySelector('#sigue').addEventListener('click', cierra);
    document.addEventListener('keydown', porTecla);
  }

  siguiente();
}

function resumenTanda(aciertos, total, mensaje, alSeguir) {
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
      <h1 class="celebra-titulo">${bien ? '¡Así se hace!' : '¡Vas por buen camino!'}</h1>
      <p class="entradilla centrado" style="margin:0 auto">${esc(mensaje)}</p>
      <div class="celebra-stats">
        <div class="celebra-stat"><span class="etiqueta" style="margin:0 0 6px">Puntuación</span><div class="puntaje-grande ${clase}" id="cifra">0<span class="cifra-chica">%</span></div></div>
        <div class="celebra-stat"><span class="etiqueta" style="margin:0 0 6px">Correctas</span><div class="puntaje-grande">${aciertos}<span class="cifra-chica">/${total}</span></div></div>
        <div class="celebra-stat"><span class="etiqueta" style="margin:0 0 6px">Hoy</span><div class="puntaje-grande">${Math.floor(segundosHoy() / 60)}<span class="cifra-chica">min</span></div></div>
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
}

// ---- vista: repaso espaciado ------------------------------------------------

function vRepaso() {
  vistaActual = 'repaso';
  const pendientes = pendientesSRS();
  if (!pendientes.length) {
    const total = Object.keys(P.srs).length;
    vista().innerHTML = `<h1>Repaso</h1>
      <p class="gris">Acá vuelven las palabras que ya viste, justo cuando están por olvidarse.</p>
      <div class="espacio"></div>
      <div class="ficha centrado">
        <p style="font-weight:650">No hay nada pendiente.</p>
        <p class="gris chica">${total ? 'Tienes ' + total + ' palabras en seguimiento; vuelve mañana.' : 'Completa la práctica de una unidad para sembrar el repaso.'}</p>
      </div>`;
    return;
  }

  // Cada palabra pendiente se convierte en un ejercicio: mitad al inglés, mitad al español.
  const ejercicios = pendientes.slice(0, 20).map(({ uid, i, palabra }, idx) => {
    const unidad = CURSO.find((x) => x.id === uid);
    const otras = baraja(unidad.vocab.filter((v) => v !== palabra)).slice(0, 3);
    if (idx % 2 === 0) {
      const opciones = baraja([palabra.es].concat(otras.map((o) => o.es)));
      return { tipo: 'opcion', q: palabra.en, audio: palabra.en, opciones, r: opciones.indexOf(palabra.es), di: palabra.en, _srs: { uid, i } };
    }
    return { tipo: 'traduce', es: palabra.es, en: [palabra.en], _srs: { uid, i } };
  });

  corredor({
    titulo: 'Repaso',
    ejercicios,
    repetirFallos: false,
    alAcierto: (ej) => { daXP(5); anotaSRS(ej._srs.uid, ej._srs.i, true); },
    alFallo: (ej) => anotaSRS(ej._srs.uid, ej._srs.i, false),
    alTerminar: (aciertos, total) => {
      guarda();
      resumenTanda(aciertos, total,
        'Las que acertaste se alejan; las falladas vuelven pronto. Así funciona la memoria.',
        () => { document.querySelectorAll('#tabs button').forEach((x) => x.classList.toggle('activo', x.dataset.vista === 'repaso')); vRepaso(); });
    }
  });
}

// ---- vista: conversación ----------------------------------------------------

let charlaHist = [];

function nivelActual() {
  for (let i = CURSO.length - 1; i >= 0; i--) {
    if (desbloqueada(i)) return CURSO[i].nivel;
  }
  return 'A0';
}

function vCharla() {
  vistaActual = 'charla';
  vista().innerHTML = `<h1>Conversar</h1>
    <p class="gris chica">Un tutor de IA que habla a tu nivel (${nivelActual()}). Escríbele en inglés; si te trabas, pregunta en español. Toca sus mensajes para escucharlos.</p>
    <div class="espacio"></div>
    <div class="charla">
      <div class="charla-msgs" id="msgs"></div>
      <div class="charla-envio">
        <input class="respuesta-texto" id="entrada" placeholder="Say something in English..." autocomplete="off">
        <button class="btn acento" id="mandar">Enviar</button>
      </div>
    </div>`;

  const msgs = $('#msgs');
  const pintaMsg = (rol, texto) => {
    const div = document.createElement('div');
    div.className = 'msg' + (rol === 'user' ? ' mio' : '');
    const partes = texto.split(/\[Mejor:\s*"?([^\]"]+)"?\]/);
    div.innerHTML = esc(partes[0].trim()) + (partes[1] ? `<span class="mejor">Mejor: &quot;${esc(partes[1])}&quot;</span>` : '');
    if (rol !== 'user') {
      div.style.cursor = 'pointer';
      div.title = 'Escuchar';
      div.addEventListener('click', () => Voz.di(partes[0].trim(), { lento: AJ.lento, dinamico: true }));
    }
    msgs.appendChild(div);
    div.scrollIntoView({ block: 'end', behavior: 'smooth' });
  };

  charlaHist.forEach((m) => pintaMsg(m.role, m.content));
  if (!charlaHist.length) {
    const saludo = P.perfil && P.perfil.nombre
      ? 'Hello, ' + P.perfil.nombre + '! Nice to see you. How are you today?'
      : 'Hello! I am your English tutor. What is your name?';
    charlaHist.push({ role: 'assistant', content: saludo });
    pintaMsg('assistant', saludo);
    Voz.di(saludo, { lento: AJ.lento, dinamico: true });
  }

  const manda = async () => {
    const texto = $('#entrada').value.trim();
    if (!texto) return;
    if (!token) { modalPase(vCharla); return; }
    $('#entrada').value = '';
    charlaHist.push({ role: 'user', content: texto });
    pintaMsg('user', texto);
    $('#mandar').disabled = true;
    try {
      const r = await fetch(API + '/ia/chat', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensajes: charlaHist, nivel: nivelActual(), nombre: P.perfil && P.perfil.nombre, motivo: P.perfil && etiquetaMotivo(P.perfil.motivo) })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || ('fallo ' + r.status));
      charlaHist.push({ role: 'assistant', content: data.texto });
      pintaMsg('assistant', data.texto);
      Voz.di(data.texto.split('[Mejor:')[0].trim(), { lento: AJ.lento, dinamico: true });
      daXP(3);
    } catch (err) {
      pintaMsg('assistant', 'No pude responder: ' + err.message +
        (String(err.message).includes('clave') ? ' (falta la clave de Groq en el worker)' : ''));
    }
    $('#mandar').disabled = false;
    $('#entrada').focus();
  };
  $('#mandar').addEventListener('click', manda);
  $('#entrada').addEventListener('keydown', (e) => { if (e.key === 'Enter') manda(); });
}

// ---- vista: perfil ----------------------------------------------------------

function vPerfil() {
  vistaActual = 'perfil';
  const aprendidas = Object.values(P.srs).filter((x) => x.caja >= 2).length;
  const enCurso = Object.keys(P.srs).length;
  const unidadesHechas = CURSO.filter((x) => examenAprobado(x.id)).length;
  const ensayos = CURSO.filter((x) => (P.unidades[x.id]?.ensayo ?? -1) >= 0).length;

  vista().innerHTML = `<h1>Progreso</h1>
    <div class="tarjetas-stats">
      <div class="stat"><div class="stat-num oro">${P.racha.dias}</div><div class="stat-nombre">días de racha</div></div>
      <div class="stat"><div class="stat-num azul">${P.xp}</div><div class="stat-nombre">XP total</div></div>
      <div class="stat"><div class="stat-num verde">${aprendidas}</div><div class="stat-nombre">palabras firmes (de ${enCurso} vistas)</div></div>
      <div class="stat"><div class="stat-num">${unidadesHechas}/${CURSO.length}</div><div class="stat-nombre">unidades aprobadas</div></div>
      <div class="stat"><div class="stat-num">${ensayos}</div><div class="stat-nombre">ensayos corregidos</div></div>
    </div>
    <h2>Exámenes</h2>
    <div class="bloques">
      ${CURSO.map((x, i) => {
        const nota = P.unidades[x.id]?.examen ?? -1;
        return `<div class="bloque" style="cursor:default">
          <span class="unidad-num" style="width:38px;height:38px;font-size:13px">${i + 1}</span>
          <span><span class="bloque-titulo">${esc(x.titulo)}</span></span>
          <span class="bloque-extra ${nota >= NOTA_EXAMEN ? 'bien' : ''}">${nota >= 0 ? nota + '%' : '—'}</span>
        </div>`;
      }).join('')}
    </div>
    <div class="espacio"></div>
    <p class="gris chica">${token ? 'Progreso sincronizado con la nube.' : 'Progreso solo en este dispositivo. Conéctalo desde Ajustes para llevarlo al celular.'}</p>`;
}

// ---- ajustes y pase ---------------------------------------------------------

function modal(html) {
  const capa = $('#capa-modal');
  capa.innerHTML = `<div class="modal">${html}</div>`;
  capa.classList.remove('oculto');
  capa.onclick = (e) => { if (e.target === capa) cierraModal(); };
  return capa;
}
function cierraModal() { $('#capa-modal').classList.add('oculto'); $('#capa-modal').innerHTML = ''; }

const btnMenu = $('#btn-menu');

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
  const capa = abrePanel(`
    <h2>Ajustes</h2>
    <div class="fila">
      <span>Audio lento<br><span class="gris chica">Todas las voces hablan más despacio</span></span>
      <label class="interruptor"><input type="checkbox" id="aj-lento" ${AJ.lento ? 'checked' : ''}><i></i></label>
    </div>
    <div class="fila">
      <span>Sincronización<br><span class="gris chica" id="aj-sync-estado">${token ? 'Conectada' : 'Sin conectar'}</span></span>
      <button class="btn secundario" id="aj-conectar" style="padding:8px 14px">${token ? 'Desconectar' : 'Conectar'}</button>
    </div>
    <div class="fila">
      <span>Tu perfil<br><span class="gris chica">${P.perfil ? esc(P.perfil.nombre) + ' &middot; ' + esc(etiquetaMotivo(P.perfil.motivo)) + (P.perfil.meta ? ' &middot; ' + P.perfil.meta + ' min/día' : '') : 'Sin completar'}</span></span>
      <button class="btn secundario" id="aj-perfil" style="padding:8px 14px">Cambiar</button>
    </div>
    <div class="fila">
      <span>Borrar progreso<br><span class="gris chica">Solo el de este dispositivo</span></span>
      <button class="btn secundario" id="aj-borrar" style="padding:8px 14px">Borrar</button>
    </div>
    <div class="espacio"></div>
    <button class="btn ancho" id="aj-cerrar">Cerrar</button>`);
  capa.querySelector('#aj-lento').addEventListener('change', (e) => {
    AJ.lento = e.target.checked;
    localStorage.setItem(CLAVE_AJUSTES, JSON.stringify(AJ));
  });
  capa.querySelector('#aj-conectar').addEventListener('click', () => {
    if (token) {
      token = ''; localStorage.removeItem(CLAVE_TOKEN);
      conectaVozNube();
      capa.querySelector('#aj-sync-estado').textContent = 'Sin conectar';
      capa.querySelector('#aj-conectar').textContent = 'Conectar';
    } else {
      cierraPanel();
      modalPase(() => {});
    }
  });
  capa.querySelector('#aj-borrar').addEventListener('click', () => {
    capa.querySelector('#aj-borrar').textContent = 'Seguro?';
    capa.querySelector('#aj-borrar').onclick = () => {
      P = progresoVacio();
      localStorage.setItem(CLAVE_LOCAL, JSON.stringify(P));
      cierraPanel(); vInicio();
    };
  });
  capa.querySelector('#aj-perfil').addEventListener('click', () => { cierraPanel(); vOnboarding(); });
  capa.querySelector('#aj-cerrar').addEventListener('click', () => cierraPanel());
});

function modalPase(despues) {
  const capa = modal(`
    <h2>Conectar</h2>
    <p class="gris chica">El pase guarda tu progreso en la nube y habilita la IA (ensayos y conversación).</p>
    <div class="espacio"></div>
    <input class="respuesta-texto" id="pase" type="password" placeholder="Pase" autocomplete="current-password">
    <p class="gris chica" id="pase-error" style="margin-top:8px"></p>
    <div class="acciones">
      <button class="btn secundario" id="pase-no">Ahora no</button>
      <button class="btn acento" id="pase-si" style="flex:1">Entrar</button>
    </div>`);
  const entra = async () => {
    const pase = capa.querySelector('#pase').value;
    if (!pase) return;
    capa.querySelector('#pase-si').disabled = true;
    try {
      const r = await fetch(API + '/entrar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pase })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'fallo');
      token = data.token;
      localStorage.setItem(CLAVE_TOKEN, token);
      conectaVozNube();
      cierraModal();
      await bajaProgreso();
      subeProgreso();
      despues();
    } catch (err) {
      capa.querySelector('#pase-error').textContent = err.message === 'pase incorrecto' ? 'Pase incorrecto.' : 'No se pudo conectar: ' + err.message;
      capa.querySelector('#pase-si').disabled = false;
    }
  };
  capa.querySelector('#pase-si').addEventListener('click', entra);
  capa.querySelector('#pase').addEventListener('keydown', (e) => { if (e.key === 'Enter') entra(); });
  capa.querySelector('#pase-no').addEventListener('click', cierraModal);
  capa.querySelector('#pase').focus();
}

// ---- arranque ---------------------------------------------------------------

// Transicion de entrada en cada cambio de vista, y "modo leccion": dentro del
// corredor y de la celebracion las tabs se esconden, como en las apps de
// idiomas — solo la tarea y el boton de abajo.
const observador = new MutationObserver(() => {
  const v = vista();
  document.body.classList.toggle('en-leccion', !!v.querySelector('.ej-cabecera, .celebra, .onboarding, .escena'));

  // El pie de accion es position:fixed, pero la animacion de entrada aplica un
  // TRANSFORM a la vista, y un ancestro transformado convierte fixed en
  // absolute: el boton salia a media pagina y saltaba abajo al acabar la
  // animacion (lo vio Dosa). Se saca del subarbol animado y se cuelga del
  // body, donde nada lo transforma. Los listeners viajan con el nodo.
  // OJO: sacarlo cambia los hijos de la vista y volveria a disparar este mismo
  // observador, que en la segunda vuelta no encontraria el pie y lo borraria.
  // Por eso se desconecta durante la mudanza y se tiran los registros.
  observador.disconnect();
  document.querySelectorAll('body > .pie-accion').forEach((x) => x.remove());
  const pie = v.querySelector('.pie-accion');
  document.body.classList.toggle('con-pie', !!pie);
  if (pie) document.body.appendChild(pie);
  observador.takeRecords();
  observador.observe(v, { childList: true });

  v.classList.remove('vista-entra');
  void v.offsetWidth;
  v.classList.add('vista-entra');
});
observador.observe(vista(), { childList: true });

pintaBarra();
conectaVozNube();
vInicio();
bajaProgreso();


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
