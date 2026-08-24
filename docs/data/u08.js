/* Unidad 8 — La hora, los días y los meses */
CURSO.push({
  id: 'u08',
  nivel: 'A1',
  titulo: 'La hora y los días',
  descripcion: 'Decir la hora, los días de la semana y los meses, con sus preposiciones: at, on, in.',

  vocab: [
    { en: 'What time is it?', es: '¿qué hora es?', ej: 'What time is it? It is three o\'clock.' },
    { en: "o'clock", es: 'en punto', ej: 'It is nine o\'clock.' },
    { en: 'half past', es: 'y media', ej: 'It is half past two.' },
    { en: 'quarter', es: 'cuarto (de hora)', ej: 'It is a quarter past six.' },
    { en: 'Monday', es: 'lunes' },
    { en: 'Tuesday', es: 'martes' },
    { en: 'Wednesday', es: 'miércoles' },
    { en: 'Thursday', es: 'jueves' },
    { en: 'Friday', es: 'viernes' },
    { en: 'Saturday', es: 'sábado' },
    { en: 'Sunday', es: 'domingo' },
    { en: 'week', es: 'semana' },
    { en: 'month', es: 'mes' },
    { en: 'today', es: 'hoy', ej: 'Today is Friday.' },
    { en: 'tomorrow', es: 'mañana (el día siguiente)', ej: 'See you tomorrow.' },
    { en: 'yesterday', es: 'ayer' },
    { en: 'January', es: 'enero' },
    { en: 'February', es: 'febrero' },
    { en: 'March', es: 'marzo' },
    { en: 'April', es: 'abril' },
    { en: 'May', es: 'mayo' },
    { en: 'June', es: 'junio' },
    { en: 'July', es: 'julio' },
    { en: 'August', es: 'agosto' },
    { en: 'September', es: 'septiembre' },
    { en: 'October', es: 'octubre' },
    { en: 'November', es: 'noviembre' },
    { en: 'December', es: 'diciembre' },
    { en: 'birthday', es: 'cumpleaños', ej: 'My birthday is in August.' },
    { en: 'class', es: 'clase', ej: 'The class starts at ten.' }
  ],

  gramatica: [
    {
      titulo: 'Decir la hora',
      html: `<p>Se pregunta <span class="ej">What time is it?</span> y se responde con It is...:</p>
        <table>
          <tr><td>3:00</td><td><span class="ej">It is three o'clock.</span></td></tr>
          <tr><td>3:30</td><td><span class="ej">It is half past three.</span> <span class="ejta">(o "three thirty")</span></td></tr>
          <tr><td>3:15</td><td><span class="ej">It is a quarter past three.</span> <span class="ejta">(o "three fifteen")</span></td></tr>
          <tr><td>3:45</td><td><span class="ej">It is a quarter to four.</span> <span class="ejta">(cuarto PARA las cuatro)</span></td></tr>
          <tr><td>3:10</td><td><span class="ej">It is ten past three.</span></td></tr>
          <tr><td>3:50</td><td><span class="ej">It is ten to four.</span></td></tr>
        </table>
        <div class="nota">La versión "digital" siempre vale y es la más fácil: 3:25 = <b>three twenty-five</b>. Si la otra te enreda, di los números y listo. <b>past</b> = pasadas las; <b>to</b> = para las.</div>`
    },
    {
      titulo: 'at, on, in: cada tiempo con su preposición',
      html: `<p>Tres preposiciones que se reparten el calendario. La regla: cuanto más grande el periodo, más "adentro" (in):</p>
        <table>
          <tr><th>Preposición</th><th>Se usa con</th><th>Ejemplo</th></tr>
          <tr><td><b>at</b></td><td>horas</td><td><span class="ej">The class starts at ten.</span></td></tr>
          <tr><td><b>on</b></td><td>días</td><td><span class="ej">I play on Saturday.</span></td></tr>
          <tr><td><b>in</b></td><td>meses, años, partes del día</td><td><span class="ej">My birthday is in August.</span></td></tr>
        </table>
        <p>Excepciones que ya conoces: <span class="ej">at night</span> y <span class="ej">on the weekend</span>.</p>
        <div class="nota">Días y meses van SIEMPRE con mayúscula: Monday, August. Escribir "monday" es error de ortografía en inglés.</div>`
    }
  ],

  dialogo: {
    titulo: 'Planeando la semana',
    lineas: [
      { q: 'A', en: 'What time is it?', es: '¿Qué hora es?' },
      { q: 'B', en: 'It is half past nine.', es: 'Son las nueve y media.' },
      { q: 'A', en: 'Oh no, my English class starts at ten!', es: '¡Ay no, mi clase de inglés empieza a las diez!' },
      { q: 'B', en: 'On Monday? Your class is on Tuesday!', es: '¿Los lunes? ¡Tu clase es los martes!' },
      { q: 'A', en: 'Today is Monday? Are you sure?', es: '¿Hoy es lunes? ¿Estás seguro?' },
      { q: 'B', en: 'Yes! Tomorrow is Tuesday.', es: '¡Sí! Mañana es martes.' },
      { q: 'A', en: 'Perfect. And your birthday is this week, no?', es: 'Perfecto. Y tu cumpleaños es esta semana, ¿no?' },
      { q: 'B', en: 'Yes! It is on Friday. We eat cake at eight!', es: '¡Sí! Es el viernes. ¡Comemos torta a las ocho!' }
    ],
    preguntas: [
      { tipo: 'opcion', q: '¿Qué hora es en el diálogo?', opciones: ['9:00', '9:30', '10:30'], r: 1, di: 'It is half past nine' },
      { tipo: 'opcion', q: '¿Qué día es la clase de inglés?', opciones: ['Lunes', 'Martes', 'Viernes'], r: 1, di: 'Your class is on Tuesday' },
      { tipo: 'opcion', q: '¿Cuándo es el cumpleaños?', opciones: ['El viernes a las ocho', 'El martes a las diez', 'Hoy'], r: 0, di: 'It is on Friday' }
    ]
  },

  ejercicios: [
    { tipo: 'parejas', pares: [['Monday', 'lunes'], ['Wednesday', 'miércoles'], ['Friday', 'viernes'], ['Saturday', 'sábado'], ['Sunday', 'domingo']] },
    { tipo: 'parejas', pares: [['January', 'enero'], ['April', 'abril'], ['August', 'agosto'], ['October', 'octubre'], ['December', 'diciembre']] },
    { tipo: 'opcion', q: '3:30 se dice:', opciones: ['half past three', 'three past half', 'half to three'], r: 0, di: 'half past three' },
    { tipo: 'opcion', q: '"A quarter to five" es:', opciones: ['5:15', '4:45', '5:45'], r: 1, di: 'a quarter to five' },
    { tipo: 'opcion', q: '¿Qué día va después de Tuesday?', opciones: ['Thursday', 'Monday', 'Wednesday'], r: 2, di: 'Wednesday', vocabIdx: 6 },
    { tipo: 'huecos', antes: 'The class starts', despues: 'nine.', opciones: ['at', 'on', 'in'], r: 0 },
    { tipo: 'huecos', antes: 'I play soccer', despues: 'Saturday.', opciones: ['at', 'on', 'in'], r: 1 },
    { tipo: 'huecos', antes: 'My birthday is', despues: 'July.', opciones: ['at', 'on', 'in'], r: 2 },
    { tipo: 'huecos', antes: 'We watch series', despues: 'night.', opciones: ['at', 'on', 'in'], r: 0 },
    { tipo: 'traduce', es: 'hoy', en: ['today'], vocabIdx: 13 },
    { tipo: 'traduce', es: 'jueves', en: ['thursday'], vocabIdx: 7 },
    { tipo: 'traduce', es: '¿Qué hora es?', en: ['what time is it'], vocabIdx: 0 },
    { tipo: 'escucha', en: 'It is half past two.' },
    { tipo: 'escucha', en: 'My birthday is in September.' },
    { tipo: 'ordena', es: 'La clase empieza a las diez.', en: 'The class starts at ten.', extra: ['on'] },
    { tipo: 'ordena', es: 'Hoy es viernes.', en: 'Today is Friday.', extra: ['on'] },
    { tipo: 'habla', en: 'What time is it?', es: '¿Qué hora es?' },
    { tipo: 'habla', en: 'My birthday is in August.', es: 'Mi cumpleaños es en agosto.' }
  ],

  examen: [
    { tipo: 'opcion', q: '"It is ten to four" es:', opciones: ['4:10', '3:50', '10:04'], r: 1, di: 'It is ten to four' },
    { tipo: 'opcion', q: '¿Qué mes va después de May?', opciones: ['June', 'April', 'July'], r: 0, di: 'June' },
    { tipo: 'opcion', q: '¿Cuál está bien escrita?', opciones: ['I work on monday', 'I work on Monday', 'I work in Monday'], r: 1, di: 'I work on Monday' },
    { tipo: 'huecos', antes: 'I get up', despues: 'six.', opciones: ['at', 'on', 'in'], r: 0 },
    { tipo: 'huecos', antes: 'The party is', despues: 'Saturday.', opciones: ['at', 'on', 'in'], r: 1 },
    { tipo: 'huecos', antes: 'It is cold', despues: 'December.', opciones: ['at', 'on', 'in'], r: 2 },
    { tipo: 'traduce', es: 'mañana (el día siguiente)', en: ['tomorrow'] },
    { tipo: 'traduce', es: 'semana', en: ['week'] },
    { tipo: 'traduce', es: 'Son las nueve en punto.', en: ["it is nine o'clock", 'it is nine oclock'] },
    { tipo: 'escucha', en: 'The class starts at a quarter past ten.' },
    { tipo: 'ordena', es: 'Mi cumpleaños es el domingo.', en: 'My birthday is on Sunday.', extra: ['in'] },
    { tipo: 'ordena', es: '¿Qué hora es?', en: 'What time is it?' }
  ],

  ensayo: {
    resumen: 'Tu semana, día por día',
    consigna: 'Escribe tu semana: qué haces cada día (On Monday I..., on Tuesday...), a qué hora, y cuándo es tu cumpleaños.',
    min: 40
  }
});
