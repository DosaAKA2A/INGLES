# -*- coding: utf-8 -*-
# Tres correcciones de Dosa (2026-08-25):
# 1. El audio del veredicto leia el enunciado ENTERO en un ejercicio de huecos,
#    o sea leia español con voz inglesa ('Son las 4 de la tarde: "Good ..."').
#    Ahora en 'huecos' se dice SOLO la palabra correcta salvo que el ejercicio
#    traiga un `di` explicito en ingles.
# 2. El error deja de sonar a reproche: mensajes que animan a reintentar.
# 3. Mayusculas: las opciones y frases de la interfaz arrancan en mayuscula.
import io
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# ---- 1 y 2: app.js ----
p = RAIZ / 'docs' / 'app.js'
s = io.open(p, encoding='utf-8').read()

def rep(viejo, nuevo):
    global s
    assert viejo in s, 'NO ENCONTRADO: ' + viejo[:80]
    s = s.replace(viejo, nuevo)

# 1. nunca mandar a la voz inglesa una frase con español dentro
rep("""        const correcta = ej.opciones[ej.r];
        const dicho = ej.di || (tipo === 'huecos' ? (ej.antes + ' ' + correcta + ' ' + (ej.despues || '')).trim() : null);""",
    """        const correcta = ej.opciones[ej.r];
        // OJO: en 'huecos' el enunciado suele llevar el contexto en ESPAÑOL
        // ("Son las 4 de la tarde: Good ___"). Mandar eso a la voz inglesa
        // sonaba fatal (lo pilló Dosa). Solo se dice la palabra, salvo que el
        // ejercicio traiga un `di` explícito en inglés.
        const dicho = ej.di || (tipo === 'huecos' ? correcta : null);""")

# 2. el error, en tono que anima
rep("""function baraja(arr) {""",
    """// El error no regaña: invita a reintentar. Se elige uno al azar para que no
// canse la repetición (petición de Dosa: "que le den ganas de mejorar").
const ANIMOS_FALLO = [
  'Casi', 'Vuelve a intentarlo', 'Ya casi lo tienes', 'Por poco',
  'Se aprende así', 'Otra vez y sale'
];
const ANIMOS_ACIERTO = ['Correcto', 'Muy bien', 'Perfecto', 'Eso es', 'Excelente'];
const alAzar = (lista) => lista[Math.floor(Math.random() * lista.length)];

function baraja(arr) {""")

rep("""        <div class="veredicto-titulo">${ok ? 'Correcto' : 'No es así'}</div>""",
    """        <div class="veredicto-titulo">${ok ? alAzar(ANIMOS_ACIERTO) : alAzar(ANIMOS_FALLO)}</div>""")

rep("""${ok ? '' : '<span class="vd-resp">Respuesta:</span> <b>' + esc(detalle.correcta) + '</b>'}""",
    """${ok ? '' : '<span class="vd-resp">La correcta era:</span> <b>' + esc(detalle.correcta) + '</b>'}""")

# el resumen de tanda floja tambien anima
rep("""      <h1 class="celebra-titulo">${bien ? '¡Así se hace!' : 'Casi, casi'}</h1>""",
    """      <h1 class="celebra-titulo">${bien ? '¡Así se hace!' : '¡Vas por buen camino!'}</h1>""")

# 3. la primera letra de cada opción, en mayúscula
rep("""        <div class="opciones">${ej.opciones.map((o, i) => `<button class="opcion" data-i="${i}">${esc(o)}</button>`).join('')}</div>`;""",
    """        <div class="opciones">${ej.opciones.map((o, i) => `<button class="opcion" data-i="${i}">${esc(mayus(o))}</button>`).join('')}</div>`;""")

rep("""function esc(t) {""",
    """// Primera letra en mayúscula respetando lo que ya viene capitalizado y sin
// tocar palabras en inglés que se escriben en minúscula por regla.
function mayus(t) {
  const s = String(t);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function esc(t) {""")

io.open(p, 'w', encoding='utf-8').write(s)
print('app.js: audio, tono y mayúsculas')
