# -*- coding: utf-8 -*-
# MAYUSCULAS DE LOS TERMINOS EN INGLES, de raiz.
#
# La regla de la casa: un termino en ingles que se le ensena al alumno va con
# mayuscula inicial, este donde este de la frase ("Andrew dice Hi y no Hello").
# Habia 375 sitios sin ella. Corregirlos a mano seria volver a lo mismo dentro
# de una semana, asi que se resuelve AL PINTAR, en un solo sitio:
#
#   terminos(t) -> si `t` es prosa en ESPANOL, pone en mayuscula cada termino
#                  del vocabulario del curso que aparezca dentro.
#
# Solo actua sobre espanol: una opcion que ya esta en ingles ("I'm fine,
# thanks") se deja en paz, porque ahi poner "Thanks" en medio seria un error.
# La distincion se hace por marcadores que el ingles A0-A1 no tiene (acentos,
# signos de apertura y una lista corta de palabras funcion del espanol).
import io
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

def parchea(nombre, cambios):
    p = RAIZ / nombre
    s = io.open(p, encoding='utf-8').read()
    for viejo, nuevo in cambios:
        assert viejo in s, 'NO ENCONTRADO en ' + nombre + ': ' + viejo[:90]
        s = s.replace(viejo, nuevo)
    io.open(p, 'w', encoding='utf-8').write(s)
    print(nombre + ': parcheado')

parchea('docs/app.js', [
("""function mayus(t) {""",
 """// ---- terminos en ingles dentro de texto en espanol --------------------------
// Se capitalizan al pintar, no en los datos: son cientos de sitios y a mano se
// vuelven a escapar. Ver herramientas/audita-mayusculas.js, que lo comprueba.

// Palabras del vocabulario demasiado ambiguas para tocarlas dentro de una
// frase en espanol (coinciden con palabras espanolas o son de una letra).
const TERMINOS_AMBIGUOS = new Set(['no', 'a', 'an', 'the', 'me', 'i', 'o', 'in', 'as', 'so', 'con', 'red', 'sale', 'come', 'toe', 'van', 'sea', 'ten', 'once', 'cola', 'pan', 'mar', 'sin', 'ha', 'son', 'ser', 'ir', 'da', 'de', 'la', 'el', 'un', 'y', 'es', 'en', 'te', 'se']);

let _terminos = null;
function terminosDelCurso() {
  if (_terminos) return _terminos;
  const bolsa = new Set();
  for (const u of (typeof CURSO !== 'undefined' ? CURSO : [])) {
    for (const v of (u.vocab || [])) bolsa.add(String(v.en).trim());
    for (const l of (u.lecciones || [])) for (const w of (l.regalos || [])) bolsa.add(String(w).trim());
  }
  _terminos = [...bolsa]
    .filter((t) => t.length > 1 && t === t.toLowerCase() && !TERMINOS_AMBIGUOS.has(t))
    .sort((a, b) => b.length - a.length);   // "good morning" antes que "good"
  return _terminos;
}

// Marcadores que el ingles de este nivel no tiene. Si aparecen, el texto es
// prosa en espanol y sus terminos ingleses deben ir en mayuscula.
const MARCA_ES = /[áéíóúñ¿¡]|\\b(el|la|los|las|un|una|del|que|para|con|por|pero|como|cuando|donde|es|son|se|su|sus|al|lo|si|ya|muy|mas|solo|forma|frase|palabra|dice|significa|responde|amigos|primera|cada|nunca|siempre|antes|despues|tambien|entre|sirve|usa|vale|va|van)\\b/i;

function terminos(t) {
  const s = String(t == null ? '' : t);
  if (!MARCA_ES.test(s)) return s;                 // esta en ingles: no se toca
  const lista = terminosDelCurso();
  // Se respetan las etiquetas HTML: solo se transforma el texto de fuera.
  return s.split(/(<[^>]+>)/).map((trozo, i) => {
    if (i % 2) return trozo;                       // la etiqueta, tal cual
    let x = trozo;
    for (const term of lista) {
      const esc = term.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
      x = x.replace(new RegExp('(^|[^\\\\p{L}\\\\p{N}])(' + esc + ')(?![\\\\p{L}\\\\p{N}])', 'giu'),
        (m, antes, hallado) => antes + hallado.charAt(0).toUpperCase() + hallado.slice(1));
    }
    return x;
  }).join('');
}

function mayus(t) {""" ),

# --- donde se pinta prosa en espanol ---
("""        ${ej.audio ? ilustracionGrande(ej.audio) : ''}
        <p class="enunciado">${ej.audio ? botonAudio(ej.audio) : ''}${enun}</p>
        <div class="opciones">${ej.opciones.map((o, i) => `<button class="opcion" data-i="${i}">${esc(tipo === 'huecos' ? o : mayus(o))}</button>`).join('')}</div>`;""",
 """        ${ej.audio ? ilustracionGrande(ej.audio) : ''}
        <p class="enunciado">${ej.audio ? botonAudio(ej.audio) : ''}${enun}</p>
        <div class="opciones">${ej.opciones.map((o, i) => `<button class="opcion" data-i="${i}">${esc(tipo === 'huecos' ? o : mayus(terminos(o)))}</button>`).join('')}</div>`;""" ),
("""      const enun = tipo === 'huecos' ? esc(ej.antes) + ' ____ ' + esc(ej.despues || '') : esc(ej.q);""",
 """      const enun = tipo === 'huecos' ? esc(ej.antes) + ' ____ ' + esc(ej.despues || '') : esc(terminos(ej.q));""" ),
("""        ${detalle.por ? `<div class="veredicto-por">${conNombre(detalle.por)}</div>` : ''}""",
 """        ${detalle.por ? `<div class="veredicto-por">${terminos(conNombre(detalle.por))}</div>` : ''}""" ),
])

parchea('docs/lecciones.js', [
("""      ${v.uso ? `<p class="carta-uso">${conNombre(v.uso)}</p>` : ''}
      ${v.nota ? `<p class="carta-nota">${conNombre(v.nota)}</p>` : ''}""",
 """      ${v.uso ? `<p class="carta-uso">${terminos(conNombre(v.uso))}</p>` : ''}
      ${v.nota ? `<p class="carta-nota">${terminos(conNombre(v.nota))}</p>` : ''}""" ),
("""    <p class="entradilla">${esc(e.lugar || '')}</p>""",
 """    <p class="entradilla">${esc(terminos(e.lugar || ''))}</p>""" ),
("""      <span class="nodo-info"><span class="nodo-titulo">${esc(l.titulo)}</span><span class="nodo-sub">${esc(sub)}</span></span>""",
 """      <span class="nodo-info"><span class="nodo-titulo">${esc(l.titulo)}</span><span class="nodo-sub">${esc(terminos(sub))}</span></span>""" ),
])

# el linter aplica exactamente la misma regla, para que lo que pase la
# auditoria sea lo que de verdad se ve en pantalla
parchea('herramientas/audita-mayusculas.js', [
("""const AMBIGUAS = new Set(['no', 'a', 'an', 'the', 'me', 'i', 'o', 'son', 'un', 'de', 'y', 'es', 'en', 'te', 'se', 'la', 'el']);""",
 """const AMBIGUAS = new Set(['no', 'a', 'an', 'the', 'me', 'i', 'o', 'in', 'as', 'so', 'con', 'red', 'sale', 'come', 'toe', 'van', 'sea', 'ten', 'once', 'cola', 'pan', 'mar', 'sin', 'ha', 'son', 'ser', 'ir', 'da', 'de', 'la', 'el', 'un', 'y', 'es', 'en', 'te', 'se']);

// Misma marca de "esto es espanol" que app.js: si el texto esta en ingles, sus
// palabras interiores NO deben capitalizarse y no se revisan.
const MARCA_ES = /[áéíóúñ¿¡]|\\b(el|la|los|las|un|una|del|que|para|con|por|pero|como|cuando|donde|es|son|se|su|sus|al|lo|si|ya|muy|mas|solo|forma|frase|palabra|dice|significa|responde|amigos|primera|cada|nunca|siempre|antes|despues|tambien|entre|sirve|usa|vale|va|van)\\b/i;""" ),
("""  const plano = String(texto).replace(/<[^>]+>/g, '');""",
 """  const plano = String(texto).replace(/<[^>]+>/g, '');
  if (!MARCA_ES.test(plano)) return;              // texto en ingles: no se toca""" ),
])
