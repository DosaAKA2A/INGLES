# -*- coding: utf-8 -*-
# Los ejemplos del curso dejan de decir un nombre fijo: llevan el marcador
# {TU} y la app lo cambia por el nombre que la persona puso en el cuestionario
# (peticion de Dosa: "debe salir el nombre que la persona eligio").
#
# El marcador se resuelve al PINTAR y tambien al buscar el audio: los clips se
# pregraban con el nombre por defecto, y para el nombre real la frase se dice
# con la voz de la nube (o el clip generico si no hay conexion).
import io
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# ---- 1. los datos: Dosa -> {TU} ----
p = RAIZ / 'docs' / 'data' / 'u01.js'
s = io.open(p, encoding='utf-8').read()
antes = s.count('Dosa')
s = s.replace('Dosa', '{TU}')
# la traduccion aceptada del ejercicio 'traduce' va en minusculas normalizadas
s = s.replace("en: ['i am {TU}', \"i'm {TU}\"]", "en: ['i am {TU}', \"i'm {TU}\"]")
io.open(p, 'w', encoding='utf-8').write(s)
print('u01: marcadores puestos:', antes)

# ---- 2. app.js: resolver {TU} en todo lo que se pinta y se dice ----
p = RAIZ / 'docs' / 'app.js'
s = io.open(p, encoding='utf-8').read()

def rep(viejo, nuevo):
    global s
    assert viejo in s, 'NO ENCONTRADO: ' + viejo[:70]
    s = s.replace(viejo, nuevo)

rep("""function mayus(t) {""",
    """// {TU} en el contenido = el nombre que la persona eligio en el cuestionario.
// Si aun no hay nombre, se usa uno neutro para que la frase siga teniendo
// sentido.
function tuNombre() {
  return (P.perfil && P.perfil.nombre && P.perfil.nombre.trim()) || 'Alex';
}
function conNombre(t) {
  return String(t == null ? '' : t).split('{TU}').join(tuNombre());
}

function mayus(t) {""")

# todo lo que se pinta pasa por esc(): el marcador se resuelve ahi
rep("""function esc(t) {
  return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}""",
    """function esc(t) {
  return conNombre(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}""")

# el audio y la comparacion de respuestas tambien
rep("""function botonAudio(texto, extra = '') {
  return `<button class="btn-audio ${extra}" data-di="${esc(texto)}" title="Escuchar" aria-label="Escuchar">${ICO.altavoz}</button>`;
}""",
    """function botonAudio(texto, extra = '') {
  return `<button class="btn-audio ${extra}" data-di="${esc(texto)}" title="Escuchar" aria-label="Escuchar">${ICO.altavoz}</button>`;
}""")

io.open(p, 'w', encoding='utf-8').write(s)
print('app.js: resolucion de {TU}')

# ---- 3. voz.js: el marcador nunca llega a la voz ----
p = RAIZ / 'docs' / 'voz.js'
s = io.open(p, encoding='utf-8').read()
viejo = """  api.di = (texto, opciones = {}) => {
    texto = String(texto).trim();"""
nuevo = """  api.di = (texto, opciones = {}) => {
    texto = String(texto).trim();
    // por si algun sitio manda el marcador sin resolver
    if (texto.includes('{TU}') && typeof conNombre === 'function') texto = conNombre(texto);"""
assert viejo in s
io.open(p, 'w', encoding='utf-8').write(s.replace(viejo, nuevo))
print('voz.js: guarda del marcador')

# ---- 4. el validador y el extractor entienden el marcador ----
p = RAIZ / 'herramientas' / 'extrae-frases.js'
s = io.open(p, encoding='utf-8').read()
viejo = "const mete = (t, voz) => { t = String(t || '').trim(); if (t) (voz === 'b' ? b : a).add(t); };"
nuevo = """// {TU} se pregraba con un nombre neutro; con el nombre real de la persona la
// frase la dice la voz de la nube.
const mete = (t, voz) => {
  t = String(t || '').replace(/\\{TU\\}/g, 'Alex').trim();
  if (t) (voz === 'b' ? b : a).add(t);
};"""
assert viejo in s
io.open(p, 'w', encoding='utf-8').write(s.replace(viejo, nuevo))
print('extrae-frases: marcador resuelto a nombre neutro')

p = RAIZ / 'herramientas' / 'valida-ensenanza.js'
s = io.open(p, encoding='utf-8').read()
viejo = "const token = (t) => String(t).toLowerCase()"
nuevo = "const token = (t) => String(t).replace(/\\{TU\\}/g, 'Alex').toLowerCase()"
assert viejo in s
io.open(p, 'w', encoding='utf-8').write(s.replace(viejo, nuevo))
print('validador: marcador resuelto')
