/* Unidad 7 — Presente simple II: he/she/it, do/does y frecuencia */
CURSO.push({
  id: 'u07',
  nivel: 'A1',
  titulo: 'Él trabaja, ella estudia',
  descripcion: 'La s de he/she/it, preguntar y negar con do/does, y decir con qué frecuencia haces las cosas.',

  vocab: [
    { en: 'always', es: 'siempre', ej: 'I always drink coffee.' },
    { en: 'usually', es: 'normalmente', ej: 'She usually works at home.' },
    { en: 'sometimes', es: 'a veces', ej: 'Sometimes we cook together.' },
    { en: 'never', es: 'nunca', ej: 'He never gets up early.' },
    { en: 'early', es: 'temprano' },
    { en: 'late', es: 'tarde' },
    { en: 'together', es: 'juntos, juntas' },
    { en: 'alone', es: 'solo, sola' },
    { en: 'like', es: 'gustar', ej: 'I like music.' },
    { en: 'want', es: 'querer', ej: 'I want water.' },
    { en: 'have', es: 'tener', ej: 'She has a dog.' },
    { en: 'do', es: 'hacer', ej: 'What do you do?' },
    { en: 'teach', es: 'enseñar', ej: 'He teaches English.' },
    { en: 'wash', es: 'lavar' },
    { en: 'finish', es: 'terminar' },
    { en: 'start', es: 'empezar' },
    { en: 'doctor', es: 'doctor, doctora' },
    { en: 'student', es: 'estudiante' },
    { en: 'job', es: 'trabajo, empleo', ej: 'She has a good job.' },
    { en: 'office', es: 'oficina' },
    { en: 'weekend', es: 'fin de semana', ej: 'We play on the weekend.' },
    { en: 'What do you do?', es: '¿a qué te dedicas?', ej: 'What do you do? I am a student.' },
    { en: 'too', es: 'también (al final)', ej: 'I like coffee too.' },
    { en: 'a lot', es: 'mucho', ej: 'She reads a lot.' }
  ],

  gramatica: [
    {
      titulo: 'La s de he, she, it',
      html: `<p>En presente simple, cuando el que hace la acción es <b>he, she o it</b>, el verbo gana una <b>-s</b>. Es LA regla del inglés básico:</p>
        <table>
          <tr><td><span class="ej">I work.</span> / <span class="ej">She works.</span></td><td class="ejta">Yo trabajo. / Ella trabaja.</td></tr>
          <tr><td><span class="ej">They live here.</span> / <span class="ej">He lives here.</span></td><td class="ejta">Ellos viven acá. / Él vive acá.</td></tr>
        </table>
        <p>Algunos verbos cambian un poco al ganar la s:</p>
        <table>
          <tr><td><span class="ej">watch - watches</span>, <span class="ej">wash - washes</span>, <span class="ej">teach - teaches</span>, <span class="ej">finish - finishes</span></td><td class="ejta">-es tras ch, sh, s, x</td></tr>
          <tr><td><span class="ej">study - studies</span></td><td class="ejta">consonante + y: la y se vuelve -ies</td></tr>
          <tr><td><span class="ej">go - goes</span>, <span class="ej">do - does</span>, <span class="ej">have - has</span></td><td class="ejta">los tres especiales de siempre</td></tr>
        </table>
        <div class="nota">Olvidar esta s es el error más común del mundo. "She work" duele al oído nativo. Truco: si puedes decir "él" o "ella" antes del verbo, el verbo lleva s.</div>`
    },
    {
      titulo: 'Preguntar y negar: do / does',
      html: `<p>Los verbos normales no saltan al frente como be: piden un ayudante. <b>do</b> para I/you/we/they y <b>does</b> para he/she/it:</p>
        <table>
          <tr><td><span class="ej">Do you like coffee?</span></td><td class="ejta">¿Te gusta el café?</td></tr>
          <tr><td><span class="ej">Does she work here?</span></td><td class="ejta">¿Ella trabaja acá?</td></tr>
          <tr><td><span class="ej">I do not like tea.</span> = <span class="ej">I don't like tea.</span></td><td class="ejta">No me gusta el té.</td></tr>
          <tr><td><span class="ej">He does not cook.</span> = <span class="ej">He doesn't cook.</span></td><td class="ejta">Él no cocina.</td></tr>
        </table>
        <div class="nota">Cuando aparece does, el verbo DEVUELVE la s: "Does she work<b>s</b>?" está mal; es <span class="ej">Does she work?</span>. La s ya la lleva does.</div>
        <p>Respuestas cortas: <span class="ej">Yes, I do.</span> / <span class="ej">No, I don't.</span> / <span class="ej">Yes, she does.</span> / <span class="ej">No, she doesn't.</span></p>`
    },
    {
      titulo: 'always, usually, sometimes, never',
      html: `<p>Las palabras de frecuencia van ANTES del verbo:</p>
        <table>
          <tr><td><span class="ej">I always drink coffee.</span></td><td class="ejta">Siempre tomo café.</td></tr>
          <tr><td><span class="ej">She usually gets up early.</span></td><td class="ejta">Normalmente se levanta temprano.</td></tr>
          <tr><td><span class="ej">We sometimes eat together.</span></td><td class="ejta">A veces comemos juntos.</td></tr>
          <tr><td><span class="ej">He never washes his car.</span></td><td class="ejta">Él nunca lava su auto.</td></tr>
        </table>
        <div class="nota">Con never el verbo va en positivo: "He never doesn't..." no existe. Never ya es la negación.</div>`
    }
  ],

  dialogo: {
    titulo: '¿A qué se dedica ella?',
    lineas: [
      { q: 'A', en: 'What do you do, Tom?', es: '¿A qué te dedicas, Tom?' },
      { q: 'B', en: 'I am a student. I study medicine.', es: 'Soy estudiante. Estudio medicina.' },
      { q: 'A', en: 'And your sister? What does she do?', es: '¿Y tu hermana? ¿A qué se dedica?' },
      { q: 'B', en: 'She is a doctor. She works in a hospital.', es: 'Es doctora. Trabaja en un hospital.' },
      { q: 'A', en: 'Does she like her job?', es: '¿Le gusta su trabajo?' },
      { q: 'B', en: 'Yes, she does. But she always gets up at five.', es: 'Sí. Pero siempre se levanta a las cinco.' },
      { q: 'A', en: 'At five? I never get up early.', es: '¿A las cinco? Yo nunca me levanto temprano.' },
      { q: 'B', en: 'Me neither. She sometimes sleeps at the hospital!', es: 'Yo tampoco. ¡A veces duerme en el hospital!' }
    ],
    preguntas: [
      { tipo: 'opcion', q: '¿Qué estudia Tom?', opciones: ['Inglés', 'Medicina', 'Música'], r: 1, di: 'I study medicine' },
      { tipo: 'opcion', q: '¿Dónde trabaja la hermana?', opciones: ['En una oficina', 'En un hospital', 'En casa'], r: 1, di: 'She works in a hospital' },
      { tipo: 'opcion', q: '¿A qué hora se levanta ella?', opciones: ['Siempre a las cinco', 'A veces a las cinco', 'Nunca temprano'], r: 0, di: 'She always gets up at five' }
    ]
  },

  ejercicios: [
    { tipo: 'parejas', pares: [['always', 'siempre'], ['usually', 'normalmente'], ['sometimes', 'a veces'], ['never', 'nunca'], ['together', 'juntos']] },
    { tipo: 'huecos', antes: 'She', despues: 'in an office.', opciones: ['work', 'works', 'working'], r: 1 },
    { tipo: 'huecos', antes: 'He', despues: 'TV at night.', opciones: ['watch', 'watchs', 'watches'], r: 2 },
    { tipo: 'huecos', antes: 'My brother', despues: 'a dog.', opciones: ['have', 'has', 'haves'], r: 1 },
    { tipo: 'huecos', antes: 'Ana', despues: 'English every day.', opciones: ['study', 'studys', 'studies'], r: 2 },
    { tipo: 'huecos', antes: '', despues: 'she like coffee?', opciones: ['Do', 'Does', 'Is'], r: 1 },
    { tipo: 'huecos', antes: 'I', despues: 'like tea.', opciones: ["don't", "doesn't", 'not'], r: 0 },
    { tipo: 'huecos', antes: 'He', despues: 'cook. He buys food.', opciones: ["don't", "doesn't", 'not'], r: 1 },
    { tipo: 'opcion', q: '¿Cuál es correcta?', opciones: ['Does she works here?', 'Does she work here?', 'Do she work here?'], r: 1, di: 'Does she work here?' },
    { tipo: 'opcion', q: '"Ella nunca llega tarde":', opciones: ['She never is late', 'She is never late', "She doesn't never late"], r: 1, di: 'She is never late' },
    { tipo: 'traduce', es: 'siempre', en: ['always'], vocabIdx: 0 },
    { tipo: 'traduce', es: 'Él vive acá.', en: ['he lives here'] },
    { tipo: 'traduce', es: '¿Te gusta el café?', en: ['do you like coffee'], vocabIdx: 8 },
    { tipo: 'escucha', en: 'She usually works at home.' },
    { tipo: 'escucha', en: "He doesn't like coffee." },
    { tipo: 'ordena', es: 'Ella siempre estudia en la noche.', en: 'She always studies at night.', extra: ['study'] },
    { tipo: 'ordena', es: '¿Él trabaja acá?', en: 'Does he work here?', extra: ['works'] },
    { tipo: 'habla', en: 'What do you do?', es: '¿A qué te dedicas?' },
    { tipo: 'habla', en: 'She works in a hospital.', es: 'Ella trabaja en un hospital.' }
  ],

  examen: [
    { tipo: 'huecos', antes: 'My mother', despues: 'dinner every day.', opciones: ['cook', 'cooks', 'cooking'], r: 1 },
    { tipo: 'huecos', antes: 'Tom', despues: 'to school at eight.', opciones: ['go', 'gos', 'goes'], r: 2 },
    { tipo: 'huecos', antes: '', despues: 'they live in Lima?', opciones: ['Do', 'Does', 'Are'], r: 0 },
    { tipo: 'huecos', antes: 'She', despues: 'want water.', opciones: ["don't", "doesn't", "isn't"], r: 1 },
    { tipo: 'opcion', q: '"Does he have a car?" — respuesta corta:', opciones: ['Yes, he has', 'Yes, he does', 'Yes, he do'], r: 1, di: 'Yes, he does' },
    { tipo: 'opcion', q: 'La palabra de frecuencia va...', opciones: ['después del verbo', 'antes del verbo', 'al final de la frase'], r: 1 },
    { tipo: 'opcion', q: '¿Cuál es correcta?', opciones: ['He never gets up early', "He doesn't never get up early", 'He never get up early'], r: 0, di: 'He never gets up early' },
    { tipo: 'traduce', es: 'temprano', en: ['early'] },
    { tipo: 'traduce', es: 'Ella tiene un buen trabajo.', en: ['she has a good job'] },
    { tipo: 'traduce', es: 'Él no cocina.', en: ["he doesn't cook", 'he does not cook'] },
    { tipo: 'escucha', en: 'What does she do on the weekend?' },
    { tipo: 'ordena', es: 'A veces comemos juntos.', en: 'We sometimes eat together.' },
    { tipo: 'ordena', es: 'Mi padre enseña inglés.', en: 'My father teaches English.', extra: ['teach'] }
  ],

  ensayo: {
    resumen: 'La rutina de otra persona',
    consigna: 'Describe la rutina de alguien más (tu mamá, un amigo, tu jefe): qué hace, dónde trabaja o estudia, qué le gusta y con qué frecuencia hace las cosas. Todo con he o she.',
    min: 40
  }
});
