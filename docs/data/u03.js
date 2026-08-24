/* Unidad 3 — Países, nacionalidades y el verbo be completo */
CURSO.push({
  id: 'u03',
  nivel: 'A0',
  titulo: 'De dónde eres',
  descripcion: 'Países e idiomas, y el verbo be con todas las personas: he, she, it, we, they.',

  vocab: [
    { en: 'country', es: 'país', ej: 'Peru is a country.' },
    { en: 'city', es: 'ciudad', ej: 'Lima is a city.' },
    { en: 'Where are you from?', es: '¿de dónde eres?', ej: 'Where are you from? I am from Peru.' },
    { en: 'I am from...', es: 'soy de...', ej: 'I am from Lima.' },
    { en: 'Spain', es: 'España' },
    { en: 'Spanish', es: 'español (idioma o de España)', ej: 'I speak Spanish.' },
    { en: 'England', es: 'Inglaterra' },
    { en: 'English', es: 'inglés', ej: 'English is easy.' },
    { en: 'the United States', es: 'Estados Unidos', ej: 'She is from the United States.' },
    { en: 'American', es: 'estadounidense', ej: 'Tom is American.' },
    { en: 'Mexico', es: 'México' },
    { en: 'Mexican', es: 'mexicano, mexicana' },
    { en: 'Peru', es: 'Perú' },
    { en: 'Peruvian', es: 'peruano, peruana' },
    { en: 'Japan', es: 'Japón' },
    { en: 'Japanese', es: 'japonés, japonesa' },
    { en: 'Brazil', es: 'Brasil' },
    { en: 'language', es: 'idioma', ej: 'English is a language.' },
    { en: 'I speak...', es: 'hablo...', ej: 'I speak Spanish and English.' },
    { en: 'he', es: 'él' },
    { en: 'she', es: 'ella' },
    { en: 'it', es: 'eso (cosa, animal, lugar)' },
    { en: 'we', es: 'nosotros, nosotras' },
    { en: 'they', es: 'ellos, ellas' },
    { en: 'and', es: 'y', ej: 'Ana and Tom are friends.' },
    { en: 'but', es: 'pero', ej: 'I am tired, but happy.' }
  ],

  gramatica: [
    {
      titulo: 'El verbo be completo: am, is, are',
      html: `<p>Be significa ser Y estar a la vez. Solo tiene tres formas en presente y se reparten así:</p>
        <table>
          <tr><th>Persona</th><th>Forma</th><th>Corto</th><th>Ejemplo</th></tr>
          <tr><td>I</td><td>am</td><td>I'm</td><td><span class="ej">I am from Peru.</span></td></tr>
          <tr><td>he / she / it</td><td>is</td><td>he's, she's, it's</td><td><span class="ej">She is Mexican.</span></td></tr>
          <tr><td>you / we / they</td><td>are</td><td>you're, we're, they're</td><td><span class="ej">They are from Japan.</span></td></tr>
        </table>
        <div class="nota"><b>it</b> no existe en español: es el pronombre para cosas, animales y lugares. "Lima? <span class="ej">It is a big city.</span>" En inglés la frase SIEMPRE necesita su pronombre; no se dice "Is a big city".</div>`
    },
    {
      titulo: 'Preguntas y negaciones con be',
      html: `<p>Para preguntar, be salta delante. Sin "do", sin trucos: se da vuelta y ya:</p>
        <table>
          <tr><td><span class="ej">You are from Spain.</span></td><td class="ejta">Eres de España.</td></tr>
          <tr><td><span class="ej">Are you from Spain?</span></td><td class="ejta">¿Eres de España?</td></tr>
          <tr><td><span class="ej">Is she American?</span></td><td class="ejta">¿Ella es estadounidense?</td></tr>
        </table>
        <p>Para negar, se mete <b>not</b> después de be:</p>
        <table>
          <tr><td><span class="ej">I am not from Mexico.</span></td><td class="ejta">No soy de México.</td></tr>
          <tr><td><span class="ej">He is not my teacher.</span> = <span class="ej">He isn't my teacher.</span></td><td class="ejta">Él no es mi profesor.</td></tr>
          <tr><td><span class="ej">They are not here.</span> = <span class="ej">They aren't here.</span></td><td class="ejta">No están acá.</td></tr>
        </table>
        <p>Y a las preguntas de sí o no se responde corto: <span class="ej">Yes, I am.</span> / <span class="ej">No, I'm not.</span> / <span class="ej">Yes, she is.</span></p>
        <div class="nota">Los países van con mayúscula y sus idiomas y gentilicios también: <b>Peru, Peruvian, Spanish, English</b>. En inglés "spanish" en minúscula es un error de escritura.</div>`
    }
  ],

  dialogo: {
    titulo: 'En un hostal',
    lineas: [
      { q: 'A', en: 'Hi! Where are you from?', es: 'Hola, ¿de dónde eres?' },
      { q: 'B', en: 'I am from Mexico. And you?', es: 'Soy de México. ¿Y tú?' },
      { q: 'A', en: 'I am from Peru, from Lima.', es: 'Soy de Perú, de Lima.' },
      { q: 'B', en: 'Nice! Is Lima a big city?', es: '¡Qué bien! ¿Lima es una ciudad grande?' },
      { q: 'A', en: 'Yes, it is. It is very big.', es: 'Sí. Es muy grande.' },
      { q: 'B', en: 'Do you see those two guys? They are from Japan.', es: '¿Ves a esos dos? Son de Japón.' },
      { q: 'A', en: 'Oh! So they speak Japanese.', es: 'Ah, entonces hablan japonés.' },
      { q: 'B', en: 'Yes, and a little English. We are all friends here.', es: 'Sí, y un poco de inglés. Acá todos somos amigos.' }
    ],
    preguntas: [
      { tipo: 'opcion', q: '¿De dónde es la persona B?', opciones: ['De Perú', 'De México', 'De Japón'], r: 1, di: 'I am from Mexico' },
      { tipo: 'opcion', q: '¿Qué dice A sobre Lima?', opciones: ['Es pequeña', 'Es muy grande', 'No es una ciudad'], r: 1, di: 'It is very big' },
      { tipo: 'opcion', q: '¿Qué hablan los dos de Japón?', opciones: ['Solo japonés', 'Japonés y un poco de inglés', 'Español'], r: 1 }
    ]
  },

  ejercicios: [
    { tipo: 'parejas', pares: [['Spain', 'España'], ['England', 'Inglaterra'], ['Japan', 'Japón'], ['Peru', 'Perú'], ['Brazil', 'Brasil']] },
    { tipo: 'huecos', antes: 'She', despues: 'from Japan.', opciones: ['am', 'is', 'are'], r: 1 },
    { tipo: 'huecos', antes: 'We', despues: 'friends.', opciones: ['am', 'is', 'are'], r: 2 },
    { tipo: 'huecos', antes: 'Lima? It', despues: 'a big city.', opciones: ['am', 'is', 'are'], r: 1 },
    { tipo: 'huecos', antes: 'They', despues: 'not from Mexico.', opciones: ['am', 'is', 'are'], r: 2 },
    { tipo: 'opcion', q: '¿Cuál es la pregunta correcta?', opciones: ['You are from Spain?', 'Are you from Spain?', 'From Spain are you?'], r: 1, di: 'Are you from Spain?' },
    { tipo: 'opcion', q: '"He isn\'t my teacher" significa:', opciones: ['Él es mi profesor', 'Él no es mi profesor', '¿Es él mi profesor?'], r: 1, di: "He isn't my teacher" },
    { tipo: 'opcion', q: 'Una persona de Estados Unidos es...', opciones: ['American', 'English', 'American States'], r: 0, di: 'American', vocabIdx: 9 },
    { tipo: 'traduce', es: 'país', en: ['country'], vocabIdx: 0 },
    { tipo: 'traduce', es: 'Soy de Perú.', en: ['i am from peru'], vocabIdx: 3 },
    { tipo: 'traduce', es: 'Hablo español e inglés.', en: ['i speak spanish and english'], vocabIdx: 18 },
    { tipo: 'escucha', en: 'Where are you from?' },
    { tipo: 'escucha', en: 'They are from England.' },
    { tipo: 'ordena', es: '¿De dónde eres?', en: 'Where are you from?', extra: ['is'] },
    { tipo: 'ordena', es: 'Ella no es de España.', en: 'She is not from Spain.', extra: ['am'] },
    { tipo: 'habla', en: 'I am from Peru.', es: 'Soy de Perú.' },
    { tipo: 'habla', en: 'Where are you from?', es: '¿De dónde eres?' }
  ],

  examen: [
    { tipo: 'huecos', antes: 'He', despues: 'from Brazil.', opciones: ['am', 'is', 'are'], r: 1 },
    { tipo: 'huecos', antes: 'You and Tom', despues: 'my friends.', opciones: ['am', 'is', 'are'], r: 2 },
    { tipo: 'huecos', antes: 'I', despues: 'not Japanese.', opciones: ['am', 'is', 'are'], r: 0 },
    { tipo: 'opcion', q: 'El pronombre para una ciudad es:', opciones: ['she', 'it', 'he'], r: 1, di: 'it' },
    { tipo: 'opcion', q: '¿Cuál está bien escrita?', opciones: ['i speak english', 'I speak English', 'I speak english'], r: 1, di: 'I speak English' },
    { tipo: 'opcion', q: '"Are they from Japan?" — respuesta corta afirmativa:', opciones: ['Yes, they are', 'Yes, they is', 'Yes, are they'], r: 0, di: 'Yes, they are' },
    { tipo: 'traduce', es: 'idioma', en: ['language'] },
    { tipo: 'traduce', es: 'Somos amigos.', en: ['we are friends'] },
    { tipo: 'traduce', es: '¿Ella es mexicana?', en: ['is she mexican'] },
    { tipo: 'escucha', en: 'I am from the United States.' },
    { tipo: 'ordena', es: 'Él no es mi amigo.', en: 'He is not my friend.' },
    { tipo: 'ordena', es: '¿Es grande la ciudad?', en: 'Is the city big?' }
  ],

  ensayo: {
    resumen: 'De dónde eres y qué hablas',
    consigna: 'Escribe sobre ti y alguien más: de dónde eres, de dónde es esa persona (he is / she is), y qué idiomas habla cada uno.',
    min: 25
  }
});
