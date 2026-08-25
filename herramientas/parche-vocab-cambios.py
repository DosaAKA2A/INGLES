# -*- coding: utf-8 -*-
# El vocabulario de la unidad 1 pasa a tener, en TODAS las palabras:
#   - `cambio`: Aria te habla a TI (con tu nombre) y debajo lo que responderias.
#     Sustituye al viejo `ej`, que repetia casi el titular de la tarjeta.
#   - `nota`: una explicacion clara SIEMPRE (peticion de Dosa: "me gusta que
#     siempre haya una explicacion... no solo vemos la respuesta").
#     `uso` sigue diciendo CUANDO se usa; `nota` da el detalle de lengua.
import io
import re
from pathlib import Path

p = Path(__file__).resolve().parent.parent / 'docs' / 'data' / 'u01.js'
s = io.open(p, encoding='utf-8').read()

# palabra -> (cambio.di, cambio.tu, nota)
DATOS = {
 'hello': ("Hello, {TU}!", "Hello, Aria!",
   "Se usa igual por escrito y hablando. La <b>h</b> sí se pronuncia, a diferencia del español: suena <i>jelou</i>."),
 'hi': ("Hi, {TU}!", "Hi, Aria!",
   "Una sola sílaba y suena <i>jai</i>. Es lo que más se oye entre gente joven."),
 'good morning': ("Good morning, {TU}!", "Good morning, Aria!",
   "Literalmente es «buena mañana». En inglés no se dice en plural como el «buenos días» del español."),
 'good afternoon': ("Good afternoon, {TU}!", "Good afternoon, Aria!",
   "<b>Afternoon</b> es <b>after</b> (después) + <b>noon</b> (mediodía): «después del mediodía»."),
 'good evening': ("Good evening, {TU}!", "Good evening, Aria!",
   "<b>Evening</b> es el final del día con gente despierta. Por eso saluda; para dormir se usa good night."),
 'good night': ("Good night, {TU}!", "Good night, Aria!",
   "Es la única de las cuatro que NO sirve para saludar. Si llegas de noche a un sitio, es good evening."),
 'goodbye': ("Goodbye, {TU}!", "Goodbye, Aria!",
   "Viene de «God be with you». Hoy suena algo formal o definitivo; en el día a día se usa más <b>bye</b>."),
 'bye': ("Bye, {TU}!", "Bye, Aria!",
   "Es goodbye recortado. Se repite mucho: <b>bye bye</b> también es normal."),
 'see you later': ("See you later, {TU}!", "See you later, Aria!",
   "Literal: «te veo luego». Se responde con la misma frase, o con un bye."),
 'please': ("Coffee, {TU}?", "Yes, please!",
   "En inglés <b>please</b> no es opcional: sin ella, pedir algo suena a orden. Va al final de la frase."),
 'thank you': ("Coffee, {TU}!", "Thank you very much!",
   "<b>Very much</b> lo refuerza: «muchas gracias». Va detrás, nunca delante."),
 'thanks': ("Coffee, {TU}!", "Thanks, Aria!",
   "Es thank you en corto. Ojo: lleva <b>s</b> final aunque sea una sola cosa la que agradeces."),
 "you're welcome": ("Thank you, {TU}!", "You're welcome, Aria!",
   "Forma corta de <b>you are welcome</b>. En inglés, <b>you are</b> casi siempre se acorta a <b>you're</b> al hablar."),
 'sorry': ("Oh! Sorry, {TU}!", "Sorry!",
   "Sirve para pedir perdón y también para compadecerse. Lo que NO hace es pedir permiso: eso es excuse me."),
 'excuse me': ("Excuse me, {TU}!", "Yes?",
   "Es la fórmula para interrumpir: llamar a alguien, pedir paso o preguntar algo. Va SIEMPRE antes."),
 'name': ("My name is Aria. And you, {TU}?", "My name is {TU}.",
   "<b>Name</b> es el sustantivo. La frase completa lleva el verbo: my name <b>is</b>..."),
 'friend': ("You are my friend, {TU}!", "You are my friend, Aria!",
   "Una sola palabra para amigo y amiga: el inglés casi no marca el género en los sustantivos."),
 'teacher': ("I am your teacher, {TU}.", "You are my teacher, Aria!",
   "Sale de <b>teach</b> (enseñar) + <b>-er</b> (quien hace algo). Ese <b>-er</b> forma muchísimos oficios."),
 "What's your name?": ("What's your name?", "My name is {TU}."
   , "Forma corta de <b>what is your name?</b> — <b>what is</b> se acorta a <b>what's</b>. Nunca se responde solo con el nombre suelto."),
 'nice to meet you': ("Nice to meet you, {TU}!", "Nice to meet you, Aria!",
   "<b>Meet</b> es conocer a alguien por primera vez, no «encontrarse con». Por eso solo vale la primera vez."),
 'How are you?': ("How are you, {TU}?", "I'm fine, thanks. And you?",
   "Es un saludo, no una pregunta de verdad sobre tu salud. Se responde corto y se devuelve."),
 "I'm fine": ("How are you, {TU}?", "I'm fine, thanks!",
   "Forma corta de <b>I am fine</b>. <b>I am</b> se acorta a <b>I'm</b>."),
 'and you?': ("I'm fine. And you?", "I'm fine, thanks!",
   "Dos palabras que salvan cualquier conversación: devuelven la pregunta sin repetirla entera."),
 'yes': ("Coffee, {TU}?", "Yes, please!",
   "Un <b>yes</b> a secas suena seco. Con <b>please</b> detrás queda educado."),
 'no': ("Coffee, {TU}?", "No, thanks!",
   "Igual que el yes: el <b>thanks</b> detrás evita que suene cortante."),
}

cambiadas = 0
faltan = []
for linea in s.split('\n'):
    m = re.match(r"    \{ en: ('([^']*)'|\"([^\"]*)\"), ", linea)
    if not m:
        continue
    palabra = m.group(2) if m.group(2) is not None else m.group(3)
    if palabra not in DATOS:
        faltan.append(palabra)
        continue
    di, tu, nota = DATOS[palabra]
    nueva = linea
    # fuera el ej viejo
    nueva = re.sub(r", ej: ('([^']|\\')*'|\"([^\"]|\\\")*\")", "", nueva)
    # fuera la nota vieja (se reescribe entera)
    nueva = re.sub(r", nota: (\"([^\"\\\\]|\\\\.)*\"|'([^'\\\\]|\\\\.)*')", "", nueva)
    cierre = nueva.rindex(' }')
    def js(t):
        return '"' + t.replace('\\', '\\\\').replace('"', '\\"') + '"'
    extra = ', nota: ' + js(nota) + ', cambio: { di: ' + js(di) + ', tu: ' + js(tu) + ' }'
    nueva = nueva[:cierre] + extra + nueva[cierre:]
    s = s.replace(linea, nueva)
    cambiadas += 1

assert not faltan, 'sin datos para: ' + ', '.join(faltan)
io.open(p, 'w', encoding='utf-8').write(s)
print('u01: %d palabras con intercambio y explicacion' % cambiadas)
