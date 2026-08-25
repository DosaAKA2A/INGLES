/* INGLES — acá se juntan las unidades del curso. Cada fichero data/uNN.js
   hace CURSO.push({...}); el orden de los <script> en index.html es el orden
   del curso. Se reparte en ficheros para poder crecer sin tocar nada más. */

'use strict';

const CURSO = [];

// ---- terminos en ingles dentro de texto en espanol --------------------------
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
const MARCA_ES = /[áéíóúñ¿¡]|\b(el|la|los|las|un|una|del|que|para|con|por|pero|como|cuando|donde|es|son|se|su|sus|al|lo|si|ya|muy|mas|solo|forma|frase|palabra|dice|significa|responde|amigos|primera|cada|nunca|siempre|antes|despues|tambien|entre|sirve|usa|vale|va|van)\b/i;

function terminos(t) {
  const s = String(t == null ? '' : t);
  if (!MARCA_ES.test(s)) return s;                 // esta en ingles: no se toca
  const lista = terminosDelCurso();
  // Se respetan las etiquetas HTML: solo se transforma el texto de fuera.
  return s.split(/(<[^>]+>)/).map((trozo, i) => {
    if (i % 2) return trozo;                       // la etiqueta, tal cual
    let x = trozo;
    for (const term of lista) {
      const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      x = x.replace(new RegExp('(^|[^\\p{L}\\p{N}])(' + esc + ')(?![\\p{L}\\p{N}])', 'giu'),
        (m, antes, hallado) => antes + hallado.charAt(0).toUpperCase() + hallado.slice(1));
    }
    return x;
  }).join('');
}

/* Esquema de una unidad:
   {
     id: 'u01', nivel: 'A0', titulo, descripcion,
     vocab: [{ en, es, ej? }],                  // ej = frase de ejemplo en inglés
     gramatica: [{ titulo, html }],             // .ej dentro del html se escucha al tocar
     dialogo: { titulo, lineas: [{q:'A'|'B', en, es}], preguntas: [ejercicios] },
     ejercicios: [...],                         // la práctica (se baraja)
     examen: [...],                             // banco del examen (se sacan 10)
     ensayo: { resumen, consigna, min }
   }
   Tipos de ejercicio:
     {tipo:'opcion',  q, opciones:[], r:idx, audio?, di?}
     {tipo:'huecos',  antes, despues?, opciones:[], r:idx}
     {tipo:'traduce', es, en:[variantes aceptadas]}
     {tipo:'escucha', en}
     {tipo:'ordena',  es, en, extra?:[palabras de más]}
     {tipo:'habla',   en, es}
     {tipo:'parejas', pares:[[en, es], ...]}
   `vocabIdx` en un ejercicio lo engancha a esa palabra del vocab para el
   repaso espaciado. */
