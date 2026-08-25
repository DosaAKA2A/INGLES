/* Unidad 12 — Presente continuo: qué está pasando ahora */
CURSO.push({
  id: 'u12',
  nivel: 'A1',
  titulo: 'Ahora mismo',
  descripcion: 'Contar qué está pasando en este momento con el presente continuo: I am working, she is eating.',

  vocab: [
    { en: 'now', es: 'ahora', ej: 'I am working now.' },
    { en: 'right now', es: 'ahora mismo' },
    { en: 'today', es: 'hoy' },
    { en: 'at the moment', es: 'en este momento' },
    { en: 'wait', es: 'esperar', ej: 'I am waiting for the bus.' },
    { en: 'rain', es: 'llover', ej: 'It is raining.' },
    { en: 'wear', es: 'llevar puesto', ej: 'She is wearing a red jacket.' },
    { en: 'jacket', es: 'chaqueta, casaca' },
    { en: 'shoes', es: 'zapatos' },
    { en: 'shirt', es: 'camisa' },
    { en: 't-shirt', es: 'polo, camiseta' },
    { en: 'pants', es: 'pantalón' },
    { en: 'hat', es: 'sombrero, gorro' },
    { en: 'look for', es: 'buscar', ej: 'I am looking for my keys.' },
    { en: 'talk', es: 'hablar, conversar', ej: 'They are talking.' },
    { en: 'write', es: 'escribir' },
    { en: 'learn', es: 'aprender', ej: 'I am learning English.' },
    { en: 'sit', es: 'sentarse' },
    { en: 'stand', es: 'estar de pie' },
    { en: 'smile', es: 'sonreír' },
    { en: 'cry', es: 'llorar' },
    { en: 'bus', es: 'bus, autobús' },
    { en: 'street', es: 'calle' },
    { en: 'park', es: 'parque' },
    { en: 'happy', es: 'feliz, contento' },
    { en: 'sad', es: 'triste' },
    { en: 'tired', es: 'cansado, cansada', ej: 'I am tired today.' },
    { en: 'busy', es: 'ocupado, ocupada' }
  ],

  gramatica: [
    {
      titulo: 'El presente continuo: be + verbo-ing',
      html: `<p>Para lo que pasa AHORA (no todos los días) el inglés junta el be que ya dominas con el verbo en -ing:</p>
        <table>
          <tr><td><span class="ej">I am working now.</span></td><td class="ejta">Estoy trabajando ahora.</td></tr>
          <tr><td><span class="ej">She is eating.</span></td><td class="ejta">Ella está comiendo.</td></tr>
          <tr><td><span class="ej">They are watching TV.</span></td><td class="ejta">Están viendo tele.</td></tr>
          <tr><td><span class="ej">It is raining.</span></td><td class="ejta">Está lloviendo.</td></tr>
        </table>
        <p>Preguntas y negaciones: como con be, sin do:</p>
        <table>
          <tr><td><span class="ej">Are you sleeping?</span></td><td class="ejta">¿Estás durmiendo?</td></tr>
          <tr><td><span class="ej">What are you doing?</span></td><td class="ejta">¿Qué estás haciendo?</td></tr>
          <tr><td><span class="ej">He isn't listening.</span></td><td class="ejta">Él no está escuchando.</td></tr>
        </table>
        <div class="nota">Ortografía del -ing: los verbos en -e la pierden (<b>write - writing</b>, <b>dance - dancing</b>) y algunos cortos doblan la última letra (<b>run - running</b>, <b>sit - sitting</b>, <b>swim - swimming</b>).</div>`
    },
    {
      titulo: 'Simple o continuo: la diferencia que importa',
      html: `<p>Los dos presentes conviven y no son intercambiables:</p>
        <table>
          <tr><th>Presente simple (siempre)</th><th>Presente continuo (ahora)</th></tr>
          <tr><td><span class="ej">I work at home.</span><br><span class="ejta">Trabajo en casa (en general).</span></td><td><span class="ej">I am working now.</span><br><span class="ejta">Estoy trabajando (en este momento).</span></td></tr>
          <tr><td><span class="ej">She drinks coffee every day.</span></td><td><span class="ej">She is drinking coffee right now.</span></td></tr>
        </table>
        <p>Las pistas: every day, always, usually piden simple; now, right now, at the moment piden continuo.</p>
        <p>El continuo también sirve para la ropa de hoy: <span class="ej">She is wearing a red jacket.</span> — ella lleva puesta una chaqueta roja.</p>
        <div class="nota">Con esta unidad cierras el nivel A1 del curso. Lo que viene después (pasado, futuro, comparativos) es el A2: el plan es agregarlo como unidades nuevas encima de estas.</div>`
    }
  ],

  dialogo: {
    titulo: 'Una videollamada',
    lineas: [
      { q: 'A', en: 'Hi! What are you doing?', es: '¡Hola! ¿Qué estás haciendo?' },
      { q: 'B', en: 'I am waiting for the bus. It is raining!', es: 'Estoy esperando el bus. ¡Está lloviendo!' },
      { q: 'A', en: 'Oh no. Are you wearing a jacket?', es: 'Ay no. ¿Llevas chaqueta?' },
      { q: 'B', en: 'Yes, and a hat. And you? What are you doing?', es: 'Sí, y un gorro. ¿Y tú? ¿Qué haces?' },
      { q: 'A', en: 'I am cooking and listening to music.', es: 'Estoy cocinando y escuchando música.' },
      { q: 'B', en: 'Nice! Is your brother helping you?', es: '¡Qué bien! ¿Tu hermano te está ayudando?' },
      { q: 'A', en: 'No, he is playing video games. As always!', es: 'No, está jugando videojuegos. ¡Como siempre!' },
      { q: 'B', en: 'Ha! The bus is coming. Talk to you later!', es: '¡Ja! Ahí viene el bus. ¡Hablamos luego!' }
    ],
    preguntas: [
      { tipo: 'opcion', q: '¿Qué está haciendo B?', opciones: ['Cocinando', 'Esperando el bus', 'Jugando'], r: 1, di: 'I am waiting for the bus' },
      { tipo: 'opcion', q: '¿Qué clima hace?', opciones: ['Está lloviendo', 'Hace calor', 'No lo dice'], r: 0, di: 'It is raining' },
      { tipo: 'opcion', q: '¿Qué está haciendo el hermano?', opciones: ['Ayudando a cocinar', 'Escuchando música', 'Jugando videojuegos'], r: 2, di: 'He is playing video games' }
    ]
  },

  ejercicios: [
    { tipo: 'parejas', pares: [['wait', 'esperar'], ['wear', 'llevar puesto'], ['write', 'escribir'], ['learn', 'aprender'], ['cry', 'llorar']] },
    { tipo: 'parejas', pares: [['jacket', 'chaqueta'], ['shoes', 'zapatos'], ['shirt', 'camisa'], ['pants', 'pantalón'], ['hat', 'gorro']] },
    { tipo: 'huecos', antes: 'I', despues: 'working now.', opciones: ['am', 'is', 'do'], r: 0 },
    { tipo: 'huecos', antes: 'She is', despues: 'a book.', opciones: ['reading', 'read', 'reads'], r: 0 },
    { tipo: 'huecos', antes: 'They', despues: 'talking right now.', opciones: ['is', 'are', 'do'], r: 1 },
    { tipo: 'huecos', antes: 'Look! It', despues: 'raining.', opciones: ['is', 'are', 'does'], r: 0 },
    { tipo: 'opcion', q: 'El -ing de write es:', opciones: ['writeing', 'writing', 'writting'], r: 1, di: 'writing', vocabIdx: 15 },
    { tipo: 'opcion', q: 'El -ing de run es:', opciones: ['runing', 'runeing', 'running'], r: 2, di: 'running' },
    { tipo: 'opcion', q: '"¿Qué estás haciendo?" en inglés:', opciones: ['What do you doing?', 'What are you doing?', 'What you are doing?'], r: 1, di: 'What are you doing?' },
    { tipo: 'opcion', q: 'Todos los días, en general:', opciones: ['I am drinking coffee every day', 'I drink coffee every day', 'I drinking coffee every day'], r: 1, di: 'I drink coffee every day' },
    { tipo: 'traduce', es: 'ahora', en: ['now'], vocabIdx: 0 },
    { tipo: 'traduce', es: 'Estoy aprendiendo inglés.', en: ['i am learning english', "i'm learning english"], vocabIdx: 16 },
    { tipo: 'traduce', es: 'Está lloviendo.', en: ['it is raining', "it's raining"], vocabIdx: 5 },
    { tipo: 'traduce', es: 'Ella lleva una chaqueta roja.', en: ['she is wearing a red jacket'], vocabIdx: 6 },
    { tipo: 'escucha', en: 'What are you doing right now?' },
    { tipo: 'escucha', en: 'He is playing video games.' },
    { tipo: 'ordena', es: 'Estoy esperando el bus.', en: 'I am waiting for the bus.', extra: ['wait'] },
    { tipo: 'ordena', es: '¿Estás durmiendo?', en: 'Are you sleeping?', extra: ['do'] },
    { tipo: 'habla', en: 'I am learning English.', es: 'Estoy aprendiendo inglés.' },
    { tipo: 'habla', en: 'What are you doing?', es: '¿Qué estás haciendo?' }
  ],

  examen: [
    { tipo: 'huecos', antes: 'He', despues: 'sitting in the park.', opciones: ['is', 'are', 'does'], r: 0 },
    { tipo: 'huecos', antes: 'We are', despues: 'English at the moment.', opciones: ['studying', 'study', 'studies'], r: 0 },
    { tipo: 'huecos', antes: 'I', despues: 'wearing shoes today.', opciones: ["am not", "don't", "isn't"], r: 0 },
    { tipo: 'opcion', q: 'El -ing de dance es:', opciones: ['danceing', 'dancing', 'dansing'], r: 1, di: 'dancing' },
    { tipo: 'opcion', q: 'El -ing de sit es:', opciones: ['siting', 'sitting', 'siteing'], r: 1, di: 'sitting' },
    { tipo: 'opcion', q: '¿Cuál pide presente continuo?', opciones: ['every day', 'usually', 'right now'], r: 2 },
    { tipo: 'opcion', q: '"She is crying" significa:', opciones: ['Ella llora siempre', 'Ella está llorando', 'Ella va a llorar'], r: 1, di: 'She is crying' },
    { tipo: 'traduce', es: 'ocupado', en: ['busy'] },
    { tipo: 'traduce', es: 'Estoy trabajando ahora.', en: ['i am working now', "i'm working now"] },
    { tipo: 'traduce', es: 'Ellos están hablando.', en: ['they are talking'] },
    { tipo: 'escucha', en: 'She is looking for her keys.' },
    { tipo: 'ordena', es: '¿Qué está haciendo él?', en: 'What is he doing?' },
    { tipo: 'ordena', es: 'No estoy durmiendo, estoy leyendo.', en: 'I am not sleeping, I am reading.' }
  ],

  ensayo: {
    resumen: 'La foto de este momento',
    consigna: 'Describe este momento exacto como si fuera una foto: qué estás haciendo, qué llevas puesto, qué están haciendo dos personas más (o tu mascota), y cómo te sientes (happy, tired, busy...).',
    min: 45
  }
});
