/* Unidad 9 — Gustos y comida: like, love, hate */
CURSO.push({
  id: 'u09',
  nivel: 'A1',
  titulo: 'Lo que me gusta',
  descripcion: 'Hablar de gustos con like, love y hate, y el vocabulario de la comida.',

  vocab: [
    { en: 'love', es: 'amar, encantar', ej: 'I love pizza.' },
    { en: 'hate', es: 'odiar', ej: 'I hate onions.' },
    { en: 'prefer', es: 'preferir', ej: 'I prefer tea.' },
    { en: 'favorite', es: 'favorito, favorita', ej: 'My favorite food is ceviche.' },
    { en: 'food', es: 'comida' },
    { en: 'bread', es: 'pan' },
    { en: 'cheese', es: 'queso' },
    { en: 'meat', es: 'carne' },
    { en: 'chicken', es: 'pollo' },
    { en: 'fish', es: 'pescado' },
    { en: 'rice', es: 'arroz' },
    { en: 'salad', es: 'ensalada' },
    { en: 'fruit', es: 'fruta' },
    { en: 'vegetables', es: 'verduras' },
    { en: 'onion', es: 'cebolla' },
    { en: 'potato', es: 'papa' },
    { en: 'milk', es: 'leche' },
    { en: 'juice', es: 'jugo' },
    { en: 'tea', es: 'té' },
    { en: 'beer', es: 'cerveza' },
    { en: 'cake', es: 'torta, pastel' },
    { en: 'ice cream', es: 'helado' },
    { en: 'chocolate', es: 'chocolate' },
    { en: 'pizza', es: 'pizza' },
    { en: 'cooking', es: 'cocinar (la actividad)', ej: 'I love cooking.' },
    { en: 'dancing', es: 'bailar (la actividad)', ej: 'She hates dancing.' },
    { en: 'reading', es: 'leer (la actividad)' },
    { en: 'delicious', es: 'delicioso', ej: 'This cake is delicious.' }
  ],

  gramatica: [
    {
      titulo: 'like, love, hate: la escala de los gustos',
      html: `<p>Tres verbos normales del presente simple, con su s de he/she y su do/does. La escala:</p>
        <table>
          <tr><td><span class="ej">I love pizza.</span></td><td class="ejta">Me encanta la pizza.</td></tr>
          <tr><td><span class="ej">I like fish.</span></td><td class="ejta">Me gusta el pescado.</td></tr>
          <tr><td><span class="ej">I don't like onions.</span></td><td class="ejta">No me gusta la cebolla.</td></tr>
          <tr><td><span class="ej">I hate beer.</span></td><td class="ejta">Odio la cerveza.</td></tr>
        </table>
        <div class="nota">En español "me gusta" lleva la cosa como sujeto; en inglés el que gusta eres TÚ: <b>I like</b> pizza (literalmente "yo gusto pizza"). No se dice "me like" ni "pizza likes me".</div>
        <p>Con he/she, la s de siempre: <span class="ej">She loves chocolate.</span> / <span class="ej">Does he like fish?</span> / <span class="ej">He doesn't like salad.</span></p>`
    },
    {
      titulo: 'Gustar HACER algo: like + -ing',
      html: `<p>Cuando lo que te gusta es una actividad, el verbo va con <b>-ing</b>:</p>
        <table>
          <tr><td><span class="ej">I love cooking.</span></td><td class="ejta">Me encanta cocinar.</td></tr>
          <tr><td><span class="ej">She likes reading at night.</span></td><td class="ejta">A ella le gusta leer de noche.</td></tr>
          <tr><td><span class="ej">We hate cleaning.</span></td><td class="ejta">Odiamos limpiar.</td></tr>
          <tr><td><span class="ej">Do you like dancing?</span></td><td class="ejta">¿Te gusta bailar?</td></tr>
        </table>
        <p>Y para preguntar el favorito: <span class="ej">What is your favorite food?</span> — <span class="ej">My favorite food is ceviche.</span></p>
        <div class="nota">Para gustos generales, la cosa va sin "the": <b>I like coffee</b> (el café en general), no "I like the coffee" (ese café en concreto).</div>`
    }
  ],

  dialogo: {
    titulo: 'En el restaurante',
    lineas: [
      { q: 'A', en: 'Do you like fish?', es: '¿Te gusta el pescado?' },
      { q: 'B', en: 'Yes, I love fish! And I love rice.', es: '¡Sí, me encanta el pescado! Y me encanta el arroz.' },
      { q: 'A', en: 'The fish with rice here is delicious.', es: 'El pescado con arroz de acá es delicioso.' },
      { q: 'B', en: 'Perfect. And what is your favorite food?', es: 'Perfecto. ¿Y cuál es tu comida favorita?' },
      { q: 'A', en: 'Chicken with potatoes. But I hate onions.', es: 'Pollo con papas. Pero odio la cebolla.' },
      { q: 'B', en: 'Me too! Onions are horrible.', es: '¡Yo también! La cebolla es horrible.' },
      { q: 'A', en: 'Do you want juice or beer?', es: '¿Quieres jugo o cerveza?' },
      { q: 'B', en: 'Juice, please. I don\'t drink beer.', es: 'Jugo, por favor. No tomo cerveza.' },
      { q: 'A', en: 'And cake for dessert. I love cake!', es: 'Y torta de postre. ¡Me encanta la torta!' }
    ],
    preguntas: [
      { tipo: 'opcion', q: '¿Qué le encanta a B?', opciones: ['El pollo y la papa', 'El pescado y el arroz', 'La cebolla'], r: 1, di: 'I love fish and I love rice' },
      { tipo: 'opcion', q: '¿Qué odia A?', opciones: ['La cebolla', 'El jugo', 'La torta'], r: 0, di: 'I hate onions' },
      { tipo: 'opcion', q: '¿Qué toma B?', opciones: ['Cerveza', 'Jugo', 'Leche'], r: 1, di: 'Juice, please' }
    ]
  },

  ejercicios: [
    { tipo: 'parejas', pares: [['cheese', 'queso'], ['chicken', 'pollo'], ['rice', 'arroz'], ['milk', 'leche'], ['cake', 'torta']] },
    { tipo: 'parejas', pares: [['bread', 'pan'], ['fish', 'pescado'], ['juice', 'jugo'], ['vegetables', 'verduras'], ['ice cream', 'helado']] },
    { tipo: 'huecos', antes: 'I', despues: 'pizza. It is my favorite.', opciones: ['love', 'loves', 'loving'], r: 0 },
    { tipo: 'huecos', antes: 'She', despues: 'chocolate.', opciones: ['love', 'loves', 'do love'], r: 1 },
    { tipo: 'huecos', antes: 'He', despues: 'like salad.', opciones: ["don't", "doesn't", 'not'], r: 1 },
    { tipo: 'huecos', antes: 'I like', despues: 'at night.', opciones: ['reading', 'read', 'reads'], r: 0 },
    { tipo: 'opcion', q: '"¿Te gusta bailar?" en inglés:', opciones: ['Do you like dancing?', 'You like dance?', 'Does you like dancing?'], r: 0, di: 'Do you like dancing?' },
    { tipo: 'opcion', q: '¿Cuál es correcta para un gusto general?', opciones: ['I like the coffee', 'I like coffee', 'I like a coffee'], r: 1, di: 'I like coffee' },
    { tipo: 'traduce', es: 'comida', en: ['food'], vocabIdx: 4 },
    { tipo: 'traduce', es: 'papa', en: ['potato'], vocabIdx: 15 },
    { tipo: 'traduce', es: 'Me encanta cocinar.', en: ['i love cooking'], vocabIdx: 24 },
    { tipo: 'traduce', es: 'Odio la cebolla. / Odio las cebollas.', en: ['i hate onions', 'i hate onion'], vocabIdx: 1 },
    { tipo: 'escucha', en: 'My favorite food is chicken with rice.' },
    { tipo: 'escucha', en: "She doesn't like vegetables." },
    { tipo: 'ordena', es: '¿Cuál es tu comida favorita?', en: 'What is your favorite food?' },
    { tipo: 'ordena', es: 'A él le encanta el helado.', en: 'He loves ice cream.', extra: ['love'] },
    { tipo: 'habla', en: 'I love pizza.', es: 'Me encanta la pizza.' },
    { tipo: 'habla', en: 'Do you like fish?', es: '¿Te gusta el pescado?' }
  ],

  examen: [
    { tipo: 'huecos', antes: 'My sister', despues: 'ice cream.', opciones: ['love', 'loves', 'loving'], r: 1 },
    { tipo: 'huecos', antes: 'They', despues: 'like meat.', opciones: ["don't", "doesn't", 'no'], r: 0 },
    { tipo: 'huecos', antes: 'We love', despues: 'together.', opciones: ['cooking', 'cook', 'cooks'], r: 0 },
    { tipo: 'opcion', q: '"Does she like tea?" — respuesta corta:', opciones: ['Yes, she likes', 'Yes, she does', 'Yes, she do'], r: 1, di: 'Yes, she does' },
    { tipo: 'opcion', q: 'Ordena de más a menos: love, like, hate', opciones: ['love, like, hate', 'like, love, hate', 'hate, like, love'], r: 0 },
    { tipo: 'traduce', es: 'verduras', en: ['vegetables'] },
    { tipo: 'traduce', es: 'delicioso', en: ['delicious'] },
    { tipo: 'traduce', es: 'Me gusta el pan con queso.', en: ['i like bread with cheese'] },
    { tipo: 'traduce', es: 'No me gusta la leche.', en: ["i don't like milk", 'i do not like milk'] },
    { tipo: 'escucha', en: 'What is your favorite food?' },
    { tipo: 'ordena', es: 'A ella le gusta leer.', en: 'She likes reading.', extra: ['like'] },
    { tipo: 'ordena', es: 'Odiamos limpiar la casa.', en: 'We hate cleaning the house.' }
  ],

  ensayo: {
    resumen: 'Tus gustos en la mesa',
    consigna: 'Escribe sobre comida: tres cosas que amas, dos que no te gustan, tu comida favorita, y qué le gusta a alguien de tu familia (she loves... / he hates...).',
    min: 40
  }
});
