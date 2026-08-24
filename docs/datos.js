/* INGLES — acá se juntan las unidades del curso. Cada fichero data/uNN.js
   hace CURSO.push({...}); el orden de los <script> en index.html es el orden
   del curso. Se reparte en ficheros para poder crecer sin tocar nada más. */

'use strict';

const CURSO = [];

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
