/* Unidad 11 — Habilidades: can / can't */
CURSO.push({
  id: 'u11',
  nivel: 'A1',
  titulo: 'Lo que sé hacer',
  descripcion: 'Decir qué puedes y qué no con can y can\'t, y pedir cosas con permiso.',

  vocab: [
    { en: 'can', es: 'poder, saber hacer', ej: 'I can swim.' },
    { en: "can't", es: 'no poder', ej: "I can't drive." },
    { en: 'swim', es: 'nadar' },
    { en: 'drive', es: 'manejar, conducir', ej: 'She can drive.' },
    { en: 'dance', es: 'bailar' },
    { en: 'sing', es: 'cantar' },
    { en: 'draw', es: 'dibujar' },
    { en: 'paint', es: 'pintar' },
    { en: 'ride a bike', es: 'andar en bicicleta', ej: 'He can ride a bike.' },
    { en: 'play the guitar', es: 'tocar guitarra', ej: 'I can play the guitar.' },
    { en: 'play soccer', es: 'jugar fútbol' },
    { en: 'jump', es: 'saltar' },
    { en: 'fly', es: 'volar' },
    { en: 'help', es: 'ayudar', ej: 'Can you help me?' },
    { en: 'open', es: 'abrir' },
    { en: 'close', es: 'cerrar' },
    { en: 'use', es: 'usar' },
    { en: 'see', es: 'ver' },
    { en: 'hear', es: 'oír', ej: "I can't hear you." },
    { en: 'remember', es: 'recordar' },
    { en: 'well', es: 'bien', ej: 'She sings very well.' },
    { en: 'very well', es: 'muy bien' },
    { en: 'a little', es: 'un poco', ej: 'I can speak English a little.' },
    { en: 'of course', es: 'claro, por supuesto', ej: 'Can you help me? Of course!' }
  ],

  gramatica: [
    {
      titulo: 'can: el verbo más cómodo del inglés',
      html: `<p><b>can</b> dice lo que sabes o puedes hacer, y es facilísimo: nunca cambia y el verbo que le sigue va pelado, sin to y sin s:</p>
        <table>
          <tr><td><span class="ej">I can swim.</span></td><td class="ejta">Sé nadar.</td></tr>
          <tr><td><span class="ej">She can drive.</span></td><td class="ejta">Ella sabe manejar. (sin s: "she cans" no existe)</td></tr>
          <tr><td><span class="ej">They can play the guitar.</span></td><td class="ejta">Ellos saben tocar guitarra.</td></tr>
        </table>
        <p>La negación es <b>can't</b> (o cannot):</p>
        <table>
          <tr><td><span class="ej">I can't fly.</span></td><td class="ejta">No puedo volar.</td></tr>
          <tr><td><span class="ej">He can't hear you.</span></td><td class="ejta">Él no te oye.</td></tr>
        </table>
        <div class="nota">Al oído, can y can't se parecen muchísimo: en "I can swim" el can suena débil y rápido ("kn"), y en "I can't swim" suena fuerte y largo. Escucha los dos en los ejercicios hasta separarlos.</div>`
    },
    {
      titulo: 'Preguntar con can: habilidad y favores',
      html: `<p>Can salta al frente, sin do ni does:</p>
        <table>
          <tr><td><span class="ej">Can you swim?</span></td><td class="ejta">¿Sabes nadar?</td></tr>
          <tr><td><span class="ej">Yes, I can.</span> / <span class="ej">No, I can't.</span></td><td class="ejta">Sí. / No.</td></tr>
          <tr><td><span class="ej">What can you do?</span></td><td class="ejta">¿Qué sabes hacer?</td></tr>
        </table>
        <p>Y sirve para pedir cosas con educación:</p>
        <table>
          <tr><td><span class="ej">Can you help me, please?</span></td><td class="ejta">¿Me ayudas, por favor?</td></tr>
          <tr><td><span class="ej">Can I use your phone?</span></td><td class="ejta">¿Puedo usar tu teléfono?</td></tr>
          <tr><td><span class="ej">Can you open the window?</span></td><td class="ejta">¿Puedes abrir la ventana?</td></tr>
        </table>
        <p>Para matizar: <span class="ej">I can cook very well.</span> / <span class="ej">I can speak English a little.</span></p>`
    }
  ],

  dialogo: {
    titulo: 'El talento escondido',
    lineas: [
      { q: 'A', en: 'Can you play the guitar?', es: '¿Sabes tocar guitarra?' },
      { q: 'B', en: 'No, I can\'t. But I can sing!', es: 'No. ¡Pero sé cantar!' },
      { q: 'A', en: 'Really? Can you sing well?', es: '¿En serio? ¿Cantas bien?' },
      { q: 'B', en: 'Very well. And you? What can you do?', es: 'Muy bien. ¿Y tú? ¿Qué sabes hacer?' },
      { q: 'A', en: 'I can draw and I can paint.', es: 'Sé dibujar y sé pintar.' },
      { q: 'B', en: 'Can you draw my cat?', es: '¿Puedes dibujar a mi gato?' },
      { q: 'A', en: 'Of course I can! But I can\'t see your cat.', es: '¡Claro que puedo! Pero no veo a tu gato.' },
      { q: 'B', en: 'He is under the sofa. He can hear us!', es: 'Está debajo del sofá. ¡Nos oye!' }
    ],
    preguntas: [
      { tipo: 'opcion', q: '¿Qué sabe hacer B?', opciones: ['Tocar guitarra', 'Cantar', 'Dibujar'], r: 1, di: 'I can sing' },
      { tipo: 'opcion', q: '¿Qué sabe hacer A?', opciones: ['Dibujar y pintar', 'Cantar y bailar', 'Nadar'], r: 0, di: 'I can draw and I can paint' },
      { tipo: 'opcion', q: '¿Dónde está el gato?', opciones: ['En el sofá', 'Debajo del sofá', 'No hay gato'], r: 1, di: 'He is under the sofa' }
    ]
  },

  ejercicios: [
    { tipo: 'parejas', pares: [['swim', 'nadar'], ['drive', 'manejar'], ['draw', 'dibujar'], ['sing', 'cantar'], ['jump', 'saltar']] },
    { tipo: 'parejas', pares: [['open', 'abrir'], ['close', 'cerrar'], ['help', 'ayudar'], ['hear', 'oír'], ['remember', 'recordar']] },
    { tipo: 'huecos', antes: 'She', despues: 'drive very well.', opciones: ['can', 'cans', 'can to'], r: 0 },
    { tipo: 'huecos', antes: 'I', despues: 'fly. Nobody can!', opciones: ['can', "can't", "don't"], r: 1 },
    { tipo: 'huecos', antes: 'He can', despues: 'the guitar.', opciones: ['play', 'plays', 'to play'], r: 0 },
    { tipo: 'huecos', antes: '', despues: 'you help me, please?', opciones: ['Can', 'Do', 'Are'], r: 0 },
    { tipo: 'opcion', q: '"¿Sabes nadar?" en inglés:', opciones: ['Do you can swim?', 'Can you swim?', 'Can you to swim?'], r: 1, di: 'Can you swim?' },
    { tipo: 'opcion', q: '"Can you sing?" — respuesta corta negativa:', opciones: ["No, I can't", "No, I don't", 'No, I not'], r: 0, di: "No, I can't" },
    { tipo: 'opcion', q: 'Pedir el teléfono de alguien:', opciones: ['Can I use your phone?', 'I can use your phone.', 'You can use my phone?'], r: 0, di: 'Can I use your phone?' },
    { tipo: 'traduce', es: 'ayudar', en: ['help'], vocabIdx: 13 },
    { tipo: 'traduce', es: 'Sé nadar.', en: ['i can swim'], vocabIdx: 2 },
    { tipo: 'traduce', es: 'Ella no sabe manejar.', en: ["she can't drive", 'she cannot drive'], vocabIdx: 3 },
    { tipo: 'traduce', es: 'Hablo inglés un poco.', en: ['i can speak english a little', 'i speak english a little'], vocabIdx: 22 },
    { tipo: 'escucha', en: 'I can swim.' },
    { tipo: 'escucha', en: "I can't swim." },
    { tipo: 'ordena', es: '¿Qué sabes hacer?', en: 'What can you do?', extra: ['does'] },
    { tipo: 'ordena', es: '¿Puedes abrir la ventana, por favor?', en: 'Can you open the window, please?' },
    { tipo: 'habla', en: 'I can speak English a little.', es: 'Hablo un poco de inglés.' },
    { tipo: 'habla', en: 'Can you help me, please?', es: '¿Me ayudas, por favor?' }
  ],

  examen: [
    { tipo: 'huecos', antes: 'My brother', despues: 'cook very well.', opciones: ['can', 'cans', 'can to'], r: 0 },
    { tipo: 'huecos', antes: 'She can', despues: 'very well.', opciones: ['dances', 'dance', 'dancing'], r: 1 },
    { tipo: 'huecos', antes: 'I', despues: 'hear you. The music is very loud!', opciones: ['can', "can't", "don't"], r: 1 },
    { tipo: 'opcion', q: '"Can she drive?" — respuesta corta afirmativa:', opciones: ['Yes, she cans', 'Yes, she can', 'Yes, she does'], r: 1, di: 'Yes, she can' },
    { tipo: 'opcion', q: '¿Cuál es correcta?', opciones: ['He can plays soccer', 'He cans play soccer', 'He can play soccer'], r: 2, di: 'He can play soccer' },
    { tipo: 'opcion', q: 'Para pedir ayuda con educación:', opciones: ['Help me!', 'Can you help me, please?', 'You help me now'], r: 1, di: 'Can you help me, please?' },
    { tipo: 'traduce', es: 'recordar', en: ['remember'] },
    { tipo: 'traduce', es: 'claro, por supuesto', en: ['of course'] },
    { tipo: 'traduce', es: 'No puedo ver.', en: ["i can't see", 'i cannot see'] },
    { tipo: 'escucha', en: 'What can you do?' },
    { tipo: 'ordena', es: 'Él sabe andar en bicicleta.', en: 'He can ride a bike.' },
    { tipo: 'ordena', es: '¿Puedo usar tu computadora?', en: 'Can I use your computer?' }
  ],

  ensayo: {
    resumen: 'Lo que sabes y no sabes hacer',
    consigna: 'Escribe qué sabes hacer (tres cosas con can), qué no (dos con can\'t), qué sabe hacer alguien que conozcas, y una pregunta pidiendo un favor.',
    min: 40
  }
});
