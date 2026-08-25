# -*- coding: utf-8 -*-
# Dos decisiones de Dosa (2026-08-25):
# 1. El umbral para desbloquear la siguiente unidad sube de 70% a 75%.
# 2. Una leccion terminada CON errores se marca distinto de una dominada: el
#    nodo dice que aun se puede afinar, en tono que no ataca ("Puedes
#    redondearla"), y ofrece repetirla. Se guarda la mejor nota de cada
#    leccion en `notas`.
import io
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# ---- 1. umbral ----
p = RAIZ / 'docs' / 'app.js'
s = io.open(p, encoding='utf-8').read()

def rep(viejo, nuevo, donde=''):
    global s
    assert viejo in s, 'NO ENCONTRADO ' + donde + ': ' + viejo[:70]
    s = s.replace(viejo, nuevo)

rep("const NOTA_EXAMEN = 70;   // % para aprobar y desbloquear la siguiente unidad",
    "const NOTA_EXAMEN = 75;   // % para aprobar y desbloquear la siguiente unidad\nconst NOTA_DOMINIO = 85;  // % desde el que una lección se considera dominada")

# guardar la mejor nota por leccion
rep("""function u(uid) {
  if (!P.unidades[uid]) P.unidades[uid] = { lec: {}, practica: 0, examen: -1, ensayo: -1 };
  if (!P.unidades[uid].lecs) P.unidades[uid].lecs = {};
  return P.unidades[uid];
}""",
    """function u(uid) {
  if (!P.unidades[uid]) P.unidades[uid] = { lec: {}, practica: 0, examen: -1, ensayo: -1 };
  if (!P.unidades[uid].lecs) P.unidades[uid].lecs = {};
  if (!P.unidades[uid].notas) P.unidades[uid].notas = {};   // mejor nota por lección
  return P.unidades[uid];
}""")

io.open(p, 'w', encoding='utf-8').write(s)
print('app.js: umbral 75 y notas por leccion')

# ---- 2. lecciones.js: el nodo distingue dominada de "se puede afinar" ----
p = RAIZ / 'docs' / 'lecciones.js'
s = io.open(p, encoding='utf-8').read()

def rep2(viejo, nuevo, donde=''):
    global s
    assert viejo in s, 'NO ENCONTRADO ' + donde + ': ' + viejo[:70]
    s = s.replace(viejo, nuevo)

rep2("""  let filas = '';
  unidad.lecciones.forEach((l, i) => {
    const hecha = !!d.lecs[l.id];
    const abierta = i === 0 || !!d.lecs[unidad.lecciones[i - 1].id];
    const actual = abierta && !hecha;
    const sub = l.sub || (l.tipo === 'vocab' ? (l.nuevas || []).length + ' palabras nuevas' : '');
    filas += `<button class="nodo ${hecha ? 'hecho' : ''} ${actual ? 'actual' : ''}" data-leccion="${i}" ${abierta ? '' : 'disabled'}>
      <span class="nodo-circulo">${imagenDeLeccion(l)}
        ${hecha ? `<span class="nodo-sello">${ICO.check}</span>` : (abierta ? '' : `<span class="nodo-sello candado">${ICO.candado}</span>`)}
      </span>
      <span class="nodo-info"><span class="nodo-titulo">${esc(l.titulo)}</span><span class="nodo-sub">${esc(sub)}</span></span>
    </button>`;
  });""",
    """  let filas = '';
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
      <span class="nodo-info"><span class="nodo-titulo">${esc(l.titulo)}</span><span class="nodo-sub">${esc(sub)}</span></span>
    </button>`;
  });""")

# aviso al pie de la unidad cuando queda algo por redondear
rep2("""    ${todasHechas ? '' : '<p class="gris chica" style="margin-top:16px">Las lecciones se abren en orden; el examen, al terminarlas todas.</p>'}`;""",
    """    ${todasHechas
      ? (unidad.lecciones.some((l) => d.notas[l.id] != null && d.notas[l.id] < NOTA_DOMINIO)
        ? '<p class="nota-afinar">Puedes repetir las lecciones marcadas para redondearlas. No es obligatorio: el examen ya está abierto.</p>'
        : '')
      : '<p class="gris chica" style="margin-top:16px">Las lecciones se abren en orden; el examen, al terminarlas todas.</p>'}`;""")

# guardar la nota y ajustar el mensaje de cierre
rep2("""function cierraLeccion(unidad, idx, aciertos, total) {
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
}""",
    """function cierraLeccion(unidad, idx, aciertos, total) {
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
}""")

io.open(p, 'w', encoding='utf-8').write(s)
print('lecciones.js: dominada vs a medias')
