# -*- coding: utf-8 -*-
# POR QUE NO SONABA NADA. Dos familias, las dos de lo mismo: se PIDE un texto
# distinto del que se PREGRABO.
#
# 1. El nombre de la persona. Los clips se graban con un nombre neutro (Alex),
#    pero la pantalla pide "Hello, Eduardo!". Sin clip y sin nube -> silencio.
#    Como ahora TODAS las tarjetas llevan intercambio con el nombre, la tarjeta
#    entera se quedaba muda. Eran 31 frases.
#
#    Regla nueva, automatica, sin tocar el contenido:
#      a) si el nombre va de VOCATIVO (", Nombre" antes del signo final), la
#         alternativa es la frase sin el vocativo: "Hello, Eduardo!" -> "Hello!"
#      b) si el nombre es parte de la frase ("My name is Eduardo."), no se
#         puede quitar: se usa el clip del nombre neutro.
#    Con pase conectado manda la nube y se oye el nombre de verdad; sin pase,
#    la alternativa. Nunca silencio.
#
# 2. Las palabras sueltas de los huecos. El veredicto dice solo la palabra
#    ("am", "are", "afternoon") pero el extractor pregrababa la frase entera.
#    Eran 32 clips que no existian.
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

# ---------------------------------------------------------------- voz.js
parchea('docs/voz.js', [
("""  api.di = (texto, opciones = {}) => {
    texto = String(texto).trim();
    // por si algun sitio manda el marcador sin resolver
    if (texto.includes('{TU}') && typeof conNombre === 'function') texto = conNombre(texto);""",
 """  // El nombre con el que se pregraban las frases que llevan {TU}.
  const NOMBRE_PREGRABADO = 'Alex';

  // La frase que se dice cuando no hay clip con el nombre REAL de la persona.
  // Vocativo -> se quita ("Hello, Eduardo!" -> "Hello!").
  // El nombre dentro de la frase no se puede quitar sin romperla ("My name is
  // Eduardo.") -> se usa el clip del nombre neutro.
  api.alternoDe = (texto) => {
    const n = (typeof tuNombre === 'function') ? tuNombre() : '';
    if (!n || !texto.includes(n)) return null;
    const esc = n.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
    const sinVocativo = texto.replace(new RegExp(',\\\\s*' + esc + '(?=\\\\s*[!?.,]|\\\\s*$)', 'g'), '');
    if (sinVocativo !== texto) return sinVocativo.trim();
    return texto.split(n).join(NOMBRE_PREGRABADO);
  };

  api.di = (texto, opciones = {}) => {
    texto = String(texto).trim();
    // por si algun sitio manda el marcador sin resolver
    if (texto.includes('{TU}') && typeof conNombre === 'function') texto = conNombre(texto);""" ),

("""    if (archivo) { suenaMP3(archivo, opciones); return; }
    if (api.nube) {
      suenaNube(texto, opciones).then((sono) => { if (!sono) suenaSintetizador(texto, opciones); });
      return;
    }
    suenaSintetizador(texto, opciones);
  };""",
 """    if (archivo) { suenaMP3(archivo, opciones); return; }

    // Sin clip exacto: la nube lo dice tal cual (con el nombre de verdad); si
    // no hay nube, se cae a la alternativa pregrabada antes que al
    // sintetizador, que en muchas maquinas ni siquiera habla ingles.
    const alterno = opciones.alterno || api.alternoDe(texto);
    const suplente = alterno && (typeof AUDIO_MAPA !== 'undefined')
      && (AUDIO_MAPA[(opciones.voz === 'b' ? 'b|' : 'a|') + alterno] || AUDIO_MAPA['a|' + alterno]
        || porMinusculas('a|' + alterno));

    if (api.nube) {
      suenaNube(texto, opciones).then((sono) => {
        if (sono) return;
        if (suplente) suenaMP3(suplente, opciones);
        else suenaSintetizador(texto, opciones);
      });
      return;
    }
    if (suplente) { suenaMP3(suplente, opciones); return; }
    suenaSintetizador(texto, opciones);
  };""" ),
])

# ------------------------------------------------------- extrae-frases.js
parchea('herramientas/extrae-frases.js', [
("""const mete = (t, voz) => {
  t = String(t || '').replace(/\\{TU\\}/g, 'Alex').trim();
  if (t) (voz === 'b' ? b : a).add(t);
};""",
 """const NEUTRO = 'Alex';

// Una frase con {TU} necesita DOS clips: el del nombre neutro (por si el
// nombre va dentro de la frase) y el de la frase sin el vocativo (que es lo
// que se oye cuando no hay nube). Misma regla que api.alternoDe en voz.js.
const mete = (t, voz) => {
  const crudo = String(t || '').trim();
  if (!crudo) return;
  const conNeutro = crudo.replace(/\\{TU\\}/g, NEUTRO).trim();
  (voz === 'b' ? b : a).add(conNeutro);
  if (crudo.includes('{TU}')) {
    const sinVocativo = crudo.replace(/,\\s*\\{TU\\}(?=\\s*[!?.,]|\\s*$)/g, '').trim();
    if (sinVocativo !== crudo) (voz === 'b' ? b : a).add(sinVocativo);
  }
};""" ),

# los huecos: el veredicto dice SOLO la palabra, no la frase entera
("""  if (ej.tipo === 'huecos') mete(ej.di || (ej.antes + ' ' + ej.opciones[ej.r] + ' ' + (ej.despues || '')).trim());""",
 """  // El veredicto de un hueco dice SOLO la palabra correcta (el enunciado suele
  // llevar contexto en espanol). Se pregraban las dos por si acaso.
  if (ej.tipo === 'huecos') { mete(ej.di || ej.opciones[ej.r]); mete(ej.opciones[ej.r]); }""" ),
])

# ------------------------------------------------- audita-audio.js: misma regla
parchea('herramientas/audita-audio.js', [
("""function hayClip(texto, voz) {
  const c = (voz === 'b' ? 'b|' : 'a|') + texto;
  return !!(AUDIO_MAPA[c] || AUDIO_MAPA['a|' + texto]
    || minus[c.toLowerCase()] || minus[('a|' + texto).toLowerCase()]);
}""",
 """function clipDe(texto, voz) {
  const c = (voz === 'b' ? 'b|' : 'a|') + texto;
  return AUDIO_MAPA[c] || AUDIO_MAPA['a|' + texto]
    || minus[c.toLowerCase()] || minus[('a|' + texto).toLowerCase()] || null;
}
// Misma regla que api.alternoDe en voz.js: sin clip exacto, se busca la
// alternativa (vocativo fuera, o el nombre neutro).
function alternoDe(texto) {
  if (!texto.includes(NOMBRE)) return null;
  const e = NOMBRE.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
  const sinVoc = texto.replace(new RegExp(',\\\\s*' + e + '(?=\\\\s*[!?.,]|\\\\s*$)', 'g'), '').trim();
  if (sinVoc !== texto) return sinVoc;
  return texto.split(NOMBRE).join('Alex');
}
function hayClip(texto, voz) {
  if (clipDe(texto, voz)) return true;
  const alt = alternoDe(texto);
  return !!(alt && clipDe(alt, voz));
}""" ),
])
