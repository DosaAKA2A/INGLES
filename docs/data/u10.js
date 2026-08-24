/* Unidad 10 — La casa y dónde están las cosas: there is/are + preposiciones */
CURSO.push({
  id: 'u10',
  nivel: 'A1',
  titulo: 'Mi casa',
  descripcion: 'Describir tu casa con there is y there are, y decir dónde está cada cosa: in, on, under...',

  vocab: [
    { en: 'room', es: 'cuarto, habitación' },
    { en: 'bedroom', es: 'dormitorio' },
    { en: 'bathroom', es: 'baño' },
    { en: 'kitchen', es: 'cocina' },
    { en: 'living room', es: 'sala' },
    { en: 'garden', es: 'jardín' },
    { en: 'bed', es: 'cama' },
    { en: 'sofa', es: 'sofá' },
    { en: 'lamp', es: 'lámpara' },
    { en: 'television', es: 'televisor', ej: 'The television is in the living room.' },
    { en: 'fridge', es: 'refrigeradora' },
    { en: 'shower', es: 'ducha' },
    { en: 'wall', es: 'pared' },
    { en: 'floor', es: 'piso, suelo' },
    { en: 'picture', es: 'cuadro, foto', ej: 'There is a picture on the wall.' },
    { en: 'plant', es: 'planta' },
    { en: 'in', es: 'en, dentro de', ej: 'The milk is in the fridge.' },
    { en: 'on', es: 'sobre, encima de', ej: 'The book is on the table.' },
    { en: 'under', es: 'debajo de', ej: 'The cat is under the bed.' },
    { en: 'next to', es: 'al lado de', ej: 'The lamp is next to the sofa.' },
    { en: 'behind', es: 'detrás de' },
    { en: 'in front of', es: 'delante de', ej: 'The car is in front of the house.' },
    { en: 'between', es: 'entre (dos cosas)' },
    { en: 'there is', es: 'hay (uno)', ej: 'There is a plant in my room.' },
    { en: 'there are', es: 'hay (varios)', ej: 'There are two bedrooms.' },
    { en: 'Where is...?', es: '¿dónde está...?', ej: 'Where is the bathroom?' }
  ],

  gramatica: [
    {
      titulo: 'there is / there are: hay',
      html: `<p>El "hay" del español se parte en dos según la cantidad:</p>
        <table>
          <tr><td><span class="ej">There is a sofa in the living room.</span></td><td class="ejta">Hay UN sofá en la sala.</td></tr>
          <tr><td><span class="ej">There are three bedrooms.</span></td><td class="ejta">Hay TRES dormitorios.</td></tr>
          <tr><td><span class="ej">Is there a bathroom here?</span></td><td class="ejta">¿Hay un baño acá?</td></tr>
          <tr><td><span class="ej">There isn't a garden.</span></td><td class="ejta">No hay jardín.</td></tr>
          <tr><td><span class="ej">There aren't any plants.</span></td><td class="ejta">No hay plantas.</td></tr>
        </table>
        <div class="nota">there is = una cosa; there are = varias. "There is two rooms" es error clásico: con plural, siempre <b>there are</b>.</div>`
    },
    {
      titulo: 'Dónde está cada cosa: las preposiciones de lugar',
      html: `<p>Las siete que resuelven casi todo:</p>
        <table>
          <tr><td><b>in</b></td><td>dentro de</td><td><span class="ej">The milk is in the fridge.</span></td></tr>
          <tr><td><b>on</b></td><td>sobre, tocando</td><td><span class="ej">The phone is on the table.</span></td></tr>
          <tr><td><b>under</b></td><td>debajo de</td><td><span class="ej">The cat is under the bed.</span></td></tr>
          <tr><td><b>next to</b></td><td>al lado de</td><td><span class="ej">The lamp is next to the sofa.</span></td></tr>
          <tr><td><b>behind</b></td><td>detrás de</td><td><span class="ej">The garden is behind the house.</span></td></tr>
          <tr><td><b>in front of</b></td><td>delante de</td><td><span class="ej">The car is in front of the door.</span></td></tr>
          <tr><td><b>between</b></td><td>entre dos</td><td><span class="ej">The table is between the sofa and the wall.</span></td></tr>
        </table>
        <p>Para preguntar: <span class="ej">Where is the bathroom?</span> — <span class="ej">It is next to the kitchen.</span> Y en plural: <span class="ej">Where are my keys?</span> — <span class="ej">They are on the table.</span></p>
        <div class="nota">Un cuadro colgado va <b>on the wall</b> (tocando la pared), no "in the wall" — in the wall sería incrustado DENTRO de la pared.</div>`
    }
  ],

  dialogo: {
    titulo: 'Buscando las llaves',
    lineas: [
      { q: 'A', en: 'Where are my keys? I need them!', es: '¿Dónde están mis llaves? ¡Las necesito!' },
      { q: 'B', en: 'Are they on the table?', es: '¿Están sobre la mesa?' },
      { q: 'A', en: 'No, there is only a lamp on the table.', es: 'No, sobre la mesa solo hay una lámpara.' },
      { q: 'B', en: 'Look under the sofa.', es: 'Mira debajo del sofá.' },
      { q: 'A', en: 'Under the sofa... no. Only the cat is under the sofa.', es: 'Debajo del sofá... no. Solo el gato está debajo del sofá.' },
      { q: 'B', en: 'In the kitchen? Next to the fridge?', es: '¿En la cocina? ¿Al lado de la refrigeradora?' },
      { q: 'A', en: 'No... wait. They are in my bag!', es: 'No... espera. ¡Están en mi bolso!' },
      { q: 'B', en: 'In your bag? They are always in your bag!', es: '¿En tu bolso? ¡Siempre están en tu bolso!' }
    ],
    preguntas: [
      { tipo: 'opcion', q: '¿Qué hay sobre la mesa?', opciones: ['Las llaves', 'Una lámpara', 'Un gato'], r: 1, di: 'There is only a lamp on the table' },
      { tipo: 'opcion', q: '¿Quién está debajo del sofá?', opciones: ['Las llaves', 'El bolso', 'El gato'], r: 2, di: 'The cat is under the sofa' },
      { tipo: 'opcion', q: '¿Dónde estaban las llaves?', opciones: ['En el bolso', 'En la cocina', 'Al lado de la refrigeradora'], r: 0, di: 'They are in my bag' }
    ]
  },

  ejercicios: [
    { tipo: 'parejas', pares: [['kitchen', 'cocina'], ['bedroom', 'dormitorio'], ['bathroom', 'baño'], ['garden', 'jardín'], ['living room', 'sala']] },
    { tipo: 'parejas', pares: [['under', 'debajo de'], ['next to', 'al lado de'], ['behind', 'detrás de'], ['between', 'entre'], ['in front of', 'delante de']] },
    { tipo: 'huecos', antes: '', despues: 'is a sofa in the living room.', opciones: ['There', 'It', 'This'], r: 0 },
    { tipo: 'huecos', antes: 'There', despues: 'two bathrooms in the house.', opciones: ['is', 'are', 'am'], r: 1 },
    { tipo: 'huecos', antes: 'The milk is', despues: 'the fridge.', opciones: ['on', 'in', 'under'], r: 1 },
    { tipo: 'huecos', antes: 'The picture is', despues: 'the wall.', opciones: ['on', 'in', 'next'], r: 0 },
    { tipo: 'huecos', antes: 'The cat sleeps', despues: 'the bed.', opciones: ['between', 'under', 'front'], r: 1 },
    { tipo: 'opcion', q: '"¿Hay un baño acá?" en inglés:', opciones: ['There is a bathroom here?', 'Is there a bathroom here?', 'Are there a bathroom here?'], r: 1, di: 'Is there a bathroom here?' },
    { tipo: 'opcion', q: '¿Cuál es correcta?', opciones: ['There is three rooms', 'There are three rooms', 'There am three rooms'], r: 1, di: 'There are three rooms' },
    { tipo: 'traduce', es: 'cocina (el cuarto)', en: ['kitchen'], vocabIdx: 3 },
    { tipo: 'traduce', es: 'cama', en: ['bed'], vocabIdx: 6 },
    { tipo: 'traduce', es: '¿Dónde está el baño?', en: ['where is the bathroom'], vocabIdx: 25 },
    { tipo: 'traduce', es: 'Hay una planta en mi cuarto.', en: ['there is a plant in my room'], vocabIdx: 23 },
    { tipo: 'escucha', en: 'The lamp is next to the sofa.' },
    { tipo: 'escucha', en: 'There are two bedrooms in my house.' },
    { tipo: 'ordena', es: 'El auto está delante de la casa.', en: 'The car is in front of the house.' },
    { tipo: 'ordena', es: 'Hay un cuadro en la pared.', en: 'There is a picture on the wall.', extra: ['are'] },
    { tipo: 'habla', en: 'Where is the bathroom?', es: '¿Dónde está el baño?' },
    { tipo: 'habla', en: 'The keys are on the table.', es: 'Las llaves están sobre la mesa.' }
  ],

  examen: [
    { tipo: 'huecos', antes: 'There', despues: 'a television in the living room.', opciones: ['is', 'are', 'have'], r: 0 },
    { tipo: 'huecos', antes: 'There', despues: 'four chairs in the kitchen.', opciones: ['is', 'are', 'be'], r: 1 },
    { tipo: 'huecos', antes: 'The shower is', despues: 'the bathroom.', opciones: ['on', 'in', 'under'], r: 1 },
    { tipo: 'huecos', antes: 'My house is', despues: 'the school and the park.', opciones: ['between', 'under', 'on'], r: 0 },
    { tipo: 'opcion', q: '"The dog is behind the door" significa:', opciones: ['El perro está delante de la puerta', 'El perro está detrás de la puerta', 'El perro está al lado de la puerta'], r: 1, di: 'The dog is behind the door' },
    { tipo: 'opcion', q: '"No hay jardín" en inglés:', opciones: ["There isn't a garden", "There aren't a garden", 'Is not a garden'], r: 0, di: "There isn't a garden" },
    { tipo: 'traduce', es: 'pared', en: ['wall'] },
    { tipo: 'traduce', es: 'sala', en: ['living room'] },
    { tipo: 'traduce', es: 'El gato está debajo de la mesa.', en: ['the cat is under the table'] },
    { tipo: 'escucha', en: 'Where are my keys? They are in your bag.' },
    { tipo: 'ordena', es: '¿Dónde está mi teléfono?', en: 'Where is my phone?' },
    { tipo: 'ordena', es: 'Hay dos plantas al lado de la ventana.', en: 'There are two plants next to the window.' }
  ],

  ensayo: {
    resumen: 'Describe tu casa',
    consigna: 'Describe tu casa o tu cuarto: qué habitaciones hay (there is / there are), y dónde están cuatro cosas usando preposiciones distintas (in, on, under, next to...).',
    min: 45
  }
});
