# -*- coding: utf-8 -*-
# Gamificacion real para el tema neumorfico: minutos de estudio medidos por dia
# (P.dias), anillo de objetivo diario + semana en la portada, chip de +pts en
# el veredicto (con el XP realmente ganado), y la moneda pasa a llamarse pts.
import io
from pathlib import Path

p = Path(__file__).resolve().parent.parent / 'docs' / 'app.js'
s = io.open(p, encoding='utf-8').read()

def rep(viejo, nuevo):
    global s
    assert viejo in s, 'NO ENCONTRADO: ' + viejo[:80]
    s = s.replace(viejo, nuevo)

# ---- 1. minutos de estudio por dia ----
rep("""function daXP(n) { tocaRacha(); P.xp += n; guarda(); }""",
    """function daXP(n) { tocaRacha(); P.xp += n; guarda(); }

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
}, 15000);""")

# ---- 2. portada: anillo del objetivo + semana ----
rep("""  const hechas = CURSO.filter((x) => examenAprobado(x.id)).length;
  let html = `<span class="etiqueta">Nivel A0 &ndash; A1</span>
    <h1>${P.perfil && P.perfil.nombre ? 'Hola, ' + esc(P.perfil.nombre) : 'Inglés desde cero'}</h1>
    <p class="entradilla">Doce unidades. Cada una se abre aprobando el examen de la anterior.</p>
    <div class="tarjetas-stats">
      <div class="stat"><div class="stat-num">${hechas}<span class="gris" style="font-size:20px">/${CURSO.length}</span></div><div class="stat-nombre">unidades aprobadas</div></div>
      <div class="stat"><div class="stat-num oro">${P.racha.dias}</div><div class="stat-nombre">días de racha</div></div>
      <div class="stat"><div class="stat-num azul">${P.xp}</div><div class="stat-nombre">experiencia</div></div>
    </div>
    <div class="unidades">`;""",
    """  const hechas = CURSO.filter((x) => examenAprobado(x.id)).length;
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
        <svg viewBox="0 0 92 92"><circle class="valor" cx="46" cy="46" r="40" stroke-dasharray="${(C * pct).toFixed(1)} ${C.toFixed(1)}"/></svg>
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
    <div class="unidades">`;""")

# ---- 3. la moneda se llama pts ----
rep("""  $('#dato-xp').innerHTML = ICO.estrella + ' ' + P.xp + ' XP';""",
    """  $('#dato-xp').innerHTML = ICO.estrella + ' ' + P.xp + ' pts';""")

# ---- 4. el veredicto ensena los puntos REALMENTE ganados ----
rep("""  function resuelve(ej, ok, detalle) {
    if (ej.pista) detalle.pista = ej.pista;
    const esRepe = yaRepetido.has(ej);
    hechos = Math.min(hechos + 1, totalPlan);
    if (ok) {
      aciertos++;
      if (alAcierto) alAcierto(ej, !esRepe);
    } else {
      if (alFallo) alFallo(ej);
      if (repetirFallos && !esRepe) { yaRepetido.add(ej); cola.push(ej); }
    }
    tocaRacha(); guarda();
    veredicto(ok, detalle, siguiente);
  }""",
    """  function resuelve(ej, ok, detalle) {
    if (ej.pista) detalle.pista = ej.pista;
    const esRepe = yaRepetido.has(ej);
    hechos = Math.min(hechos + 1, totalPlan);
    const xpAntes = P.xp;
    if (ok) {
      aciertos++;
      if (alAcierto) alAcierto(ej, !esRepe);
    } else {
      if (alFallo) alFallo(ej);
      if (repetirFallos && !esRepe) { yaRepetido.add(ej); cola.push(ej); }
    }
    detalle.pts = P.xp - xpAntes;
    tocaRacha(); guarda();
    veredicto(ok, detalle, siguiente);
  }""")

rep("""      <button class="btn ${ok ? 'acento' : 'mal'}" id="sigue">Seguir</button>
    </div>`;""",
    """      ${detalle.pts > 0 ? `<span class="vd-pts">+${detalle.pts} pts</span>` : ''}
      <button class="btn ${ok ? 'acento' : 'mal'}" id="sigue">Seguir</button>
    </div>`;""")

# ---- 5. la celebracion habla de puntos y minutos ----
rep("""      <div class="celebra-stats">
        <div class="celebra-stat"><span class="etiqueta" style="margin:0 0 6px">Puntuación</span><div class="puntaje-grande ${clase}" id="cifra">0<span class="cifra-chica">%</span></div></div>
        <div class="celebra-stat"><span class="etiqueta" style="margin:0 0 6px">Correctas</span><div class="puntaje-grande">${aciertos}<span class="cifra-chica">/${total}</span></div></div>
      </div>""",
    """      <div class="celebra-stats">
        <div class="celebra-stat"><span class="etiqueta" style="margin:0 0 6px">Puntuación</span><div class="puntaje-grande ${clase}" id="cifra">0<span class="cifra-chica">%</span></div></div>
        <div class="celebra-stat"><span class="etiqueta" style="margin:0 0 6px">Correctas</span><div class="puntaje-grande">${aciertos}<span class="cifra-chica">/${total}</span></div></div>
        <div class="celebra-stat"><span class="etiqueta" style="margin:0 0 6px">Hoy</span><div class="puntaje-grande">${Math.floor(segundosHoy() / 60)}<span class="cifra-chica">min</span></div></div>
      </div>""")

io.open(p, 'w', encoding='utf-8').write(s)
print('gamificacion aplicada')
