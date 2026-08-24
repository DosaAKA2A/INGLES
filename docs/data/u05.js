/* Unidad 5 — Objetos de todos los días: a/an, plurales y this/that */
CURSO.push({
  id: 'u05',
  nivel: 'A1',
  titulo: 'Las cosas de todos los días',
  descripcion: 'Nombrar objetos con a/an, hacer plurales y señalar con this, that, these y those.',

  vocab: [
    { en: 'book', es: 'libro', ej: 'This is a good book.' },
    { en: 'pen', es: 'lapicero, pluma' },
    { en: 'phone', es: 'teléfono, celular', ej: 'My phone is new.' },
    { en: 'computer', es: 'computadora' },
    { en: 'key', es: 'llave', ej: 'Where are my keys?' },
    { en: 'bag', es: 'bolso, mochila' },
    { en: 'chair', es: 'silla' },
    { en: 'table', es: 'mesa' },
    { en: 'door', es: 'puerta' },
    { en: 'window', es: 'ventana' },
    { en: 'car', es: 'auto, carro' },
    { en: 'house', es: 'casa' },
    { en: 'water', es: 'agua', ej: 'A glass of water, please.' },
    { en: 'coffee', es: 'café' },
    { en: 'apple', es: 'manzana', ej: 'An apple a day.' },
    { en: 'orange', es: 'naranja' },
    { en: 'egg', es: 'huevo' },
    { en: 'umbrella', es: 'paraguas' },
    { en: 'watch', es: 'reloj (de pulsera)' },
    { en: 'glass', es: 'vaso' },
    { en: 'box', es: 'caja' },
    { en: 'new', es: 'nuevo, nueva', ej: 'Her car is new.' },
    { en: 'big', es: 'grande' },
    { en: 'small', es: 'pequeño, chico' },
    { en: 'good', es: 'bueno' },
    { en: 'bad', es: 'malo' },
    { en: 'What is this?', es: '¿qué es esto?', ej: 'What is this? It is a key.' }
  ],

  gramatica: [
    {
      titulo: 'a / an: un, una',
      html: `<p><b>a</b> y <b>an</b> son la misma palabra (un/una). Se elige por el SONIDO que sigue, no por la letra:</p>
        <table>
          <tr><td><span class="ej">a book</span>, <span class="ej">a pen</span>, <span class="ej">a house</span></td><td class="ejta">antes de sonido de consonante</td></tr>
          <tr><td><span class="ej">an apple</span>, <span class="ej">an egg</span>, <span class="ej">an umbrella</span></td><td class="ejta">antes de sonido de vocal (a, e, i, o, u)</td></tr>
        </table>
        <p>El adjetivo va ANTES del nombre y no cambia nunca: <span class="ej">a big house</span>, <span class="ej">a small car</span>, <span class="ej">two big houses</span> (big no tiene plural).</p>
        <div class="nota">En inglés no puedes decir un objeto "pelado": "is book" no existe. O lleva a/an, o the, o un posesivo: <b>a book / the book / my book</b>.</div>`
    },
    {
      titulo: 'Plurales: -s, -es y los rebeldes',
      html: `<p>La regla general es agregar <b>-s</b>: <span class="ej">one pen, two pens</span>. Con palabras que terminan en s, sh, ch, x se agrega <b>-es</b>:</p>
        <table>
          <tr><td><span class="ej">one glass, two glasses</span></td><td class="ejta">un vaso, dos vasos</td></tr>
          <tr><td><span class="ej">one watch, two watches</span></td><td class="ejta">un reloj, dos relojes</td></tr>
          <tr><td><span class="ej">one box, two boxes</span></td><td class="ejta">una caja, dos cajas</td></tr>
        </table>
        <p>Y hay irregulares que hay que saberse: <span class="ej">man - men</span>, <span class="ej">woman - women</span>, <span class="ej">child - children</span>, <span class="ej">person - people</span>.</p>`
    },
    {
      titulo: 'this, that, these, those: señalar',
      html: `<p>Cuatro palabras según distancia y cantidad:</p>
        <table>
          <tr><th></th><th>Cerca</th><th>Lejos</th></tr>
          <tr><td>Uno</td><td><span class="ej">this</span> — este, esta, esto</td><td><span class="ej">that</span> — ese, aquella</td></tr>
          <tr><td>Varios</td><td><span class="ej">these</span> — estos, estas</td><td><span class="ej">those</span> — esos, aquellas</td></tr>
        </table>
        <table>
          <tr><td><span class="ej">This is my phone.</span></td><td class="ejta">Este es mi teléfono. (lo tengo en la mano)</td></tr>
          <tr><td><span class="ej">That is my car.</span></td><td class="ejta">Ese es mi auto. (está allá)</td></tr>
          <tr><td><span class="ej">These keys are old.</span></td><td class="ejta">Estas llaves son viejas.</td></tr>
          <tr><td><span class="ej">Those houses are big.</span></td><td class="ejta">Aquellas casas son grandes.</td></tr>
        </table>
        <div class="nota">this y these suenan parecido: this termina en "s" corta y <b>these</b> alarga la i ("dsiis"). Escucha las dos varias veces en el vocabulario.</div>`
    }
  ],

  dialogo: {
    titulo: 'Ordenando el cuarto',
    lineas: [
      { q: 'A', en: 'What is this?', es: '¿Qué es esto?' },
      { q: 'B', en: 'It is a watch. It is my father\'s watch.', es: 'Es un reloj. Es el reloj de mi padre.' },
      { q: 'A', en: 'And these keys? Are they your keys?', es: '¿Y estas llaves? ¿Son tus llaves?' },
      { q: 'B', en: 'No, those are my mother\'s keys.', es: 'No, esas son las llaves de mi madre.' },
      { q: 'A', en: 'There is an umbrella here too.', es: 'Acá hay un paraguas también.' },
      { q: 'B', en: 'Oh, that is my umbrella! Thanks.', es: 'Ah, ¡ese es mi paraguas! Gracias.' },
      { q: 'A', en: 'Your room is small, but it is good.', es: 'Tu cuarto es chico, pero está bien.' },
      { q: 'B', en: 'Yes, and the window is big.', es: 'Sí, y la ventana es grande.' }
    ],
    preguntas: [
      { tipo: 'opcion', q: '¿De quién es el reloj?', opciones: ['Del padre', 'De la madre', 'De B'], r: 0, di: "It is my father's watch" },
      { tipo: 'opcion', q: '¿De quién son las llaves?', opciones: ['De B', 'De la madre', 'Del padre'], r: 1, di: "Those are my mother's keys" },
      { tipo: 'opcion', q: '¿Cómo es el cuarto?', opciones: ['Grande y malo', 'Chico pero bueno', 'Nuevo'], r: 1, di: 'Your room is small, but it is good' }
    ]
  },

  ejercicios: [
    { tipo: 'parejas', pares: [['key', 'llave'], ['chair', 'silla'], ['window', 'ventana'], ['bag', 'bolso'], ['watch', 'reloj']] },
    { tipo: 'huecos', antes: 'It is', despues: 'apple.', opciones: ['a', 'an', 'two'], r: 1 },
    { tipo: 'huecos', antes: 'This is', despues: 'book.', opciones: ['a', 'an', 'these'], r: 0 },
    { tipo: 'huecos', antes: 'I have', despues: 'umbrella.', opciones: ['a', 'an', 'those'], r: 1 },
    { tipo: 'opcion', q: 'El plural de watch es:', opciones: ['watchs', 'watches', 'watch'], r: 1, di: 'watches', vocabIdx: 18 },
    { tipo: 'opcion', q: 'El plural de woman es:', opciones: ['womans', 'womens', 'women'], r: 2, di: 'women' },
    { tipo: 'opcion', q: 'Señalas unas llaves que tienes en la mano:', opciones: ['those keys', 'these keys', 'that keys'], r: 1, di: 'these keys' },
    { tipo: 'opcion', q: 'Señalas un auto al otro lado de la calle:', opciones: ['this car', 'these car', 'that car'], r: 2, di: 'that car' },
    { tipo: 'traduce', es: 'una casa grande', en: ['a big house'], vocabIdx: 11 },
    { tipo: 'traduce', es: 'dos vasos', en: ['two glasses'], vocabIdx: 19 },
    { tipo: 'traduce', es: '¿Qué es esto?', en: ['what is this'], vocabIdx: 26 },
    { tipo: 'escucha', en: 'These are my keys.' },
    { tipo: 'escucha', en: 'That is a small window.' },
    { tipo: 'ordena', es: 'Esta es una silla nueva.', en: 'This is a new chair.', extra: ['an'] },
    { tipo: 'ordena', es: 'Esas cajas son grandes.', en: 'Those boxes are big.', extra: ['that'] },
    { tipo: 'habla', en: 'What is this?', es: '¿Qué es esto?' },
    { tipo: 'habla', en: 'This is my new phone.', es: 'Este es mi celular nuevo.' }
  ],

  examen: [
    { tipo: 'huecos', antes: 'She has', despues: 'orange.', opciones: ['a', 'an', 'these'], r: 1 },
    { tipo: 'huecos', antes: 'He has', despues: 'new car.', opciones: ['a', 'an', 'those'], r: 0 },
    { tipo: 'opcion', q: 'El plural de box es:', opciones: ['boxs', 'boxes', 'boxies'], r: 1, di: 'boxes' },
    { tipo: 'opcion', q: 'El plural de person es:', opciones: ['persons', 'people', 'peoples'], r: 1, di: 'people' },
    { tipo: 'opcion', q: '"Aquellas ventanas" es:', opciones: ['these windows', 'this windows', 'those windows'], r: 2, di: 'those windows' },
    { tipo: 'opcion', q: '¿Cuál es correcta?', opciones: ['a egg', 'an egg', 'an eggs'], r: 1, di: 'an egg' },
    { tipo: 'traduce', es: 'un auto pequeño', en: ['a small car'] },
    { tipo: 'traduce', es: 'Estos libros son buenos.', en: ['these books are good'] },
    { tipo: 'traduce', es: 'puerta', en: ['door'] },
    { tipo: 'escucha', en: 'Where are my keys?' },
    { tipo: 'ordena', es: 'Ese es el teléfono de Ana.', en: "That is Ana's phone." },
    { tipo: 'ordena', es: 'La mesa es vieja pero buena.', en: 'The table is old but good.' }
  ],

  ensayo: {
    resumen: 'Cinco cosas de tu cuarto',
    consigna: 'Describe cinco objetos que tengas cerca: qué son (this is a...), cómo son (big, small, new, old, good) y de quién son.',
    min: 30
  }
});
