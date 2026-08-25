/* Unidad 1 — Hola y adiós (formato de LECCIONES: presenta poco, practica ya).
   Objetivo práctico: saludar, agradecer, presentarte y tener tu primera
   miniconversación real. Cada ejercicio usa SOLO lo ya presentado. */
CURSO.push({
  id: 'u01',
  nivel: 'A0',
  titulo: 'Hola y adiós',
  descripcion: 'Al terminar esta unidad puedes saludar, dar las gracias, presentarte y tener tu primera conversación corta.',

  vocab: [
    { en: 'hello', es: 'hola', ej: 'Hello, Ana!' },                                    // 0
    { en: 'hi', es: 'hola (informal)', ej: 'Hi, Tom!' },                               // 1
    { en: 'good morning', es: 'buenos días', ej: 'Good morning!' },                    // 2
    { en: 'good afternoon', es: 'buenas tardes', ej: 'Good afternoon!' },              // 3
    { en: 'good evening', es: 'buenas noches (al llegar)', ej: 'Good evening!' },      // 4
    { en: 'good night', es: 'buenas noches (al irse a dormir)', ej: 'Good night!' },   // 5
    { en: 'goodbye', es: 'adiós', ej: 'Goodbye, Ana!' },                               // 6
    { en: 'bye', es: 'chau (informal)', ej: 'Bye, Tom!' },                             // 7
    { en: 'see you later', es: 'nos vemos luego', ej: 'See you later!' },              // 8
    { en: 'please', es: 'por favor', ej: 'Coffee, please.' },                          // 9
    { en: 'thank you', es: 'gracias', ej: 'Thank you very much.' },                    // 10
    { en: 'thanks', es: 'gracias (informal)', ej: 'Thanks, Ana!' },                    // 11
    { en: "you're welcome", es: 'de nada', ej: "Thanks! You're welcome." },            // 12
    { en: 'sorry', es: 'perdón, lo siento', ej: 'Sorry!' },                            // 13
    { en: 'excuse me', es: 'disculpe (para llamar la atención o pasar)', ej: 'Excuse me!' }, // 14
    { en: 'name', es: 'nombre', ej: 'My name is Dosa.' },                              // 15
    { en: 'friend', es: 'amigo, amiga', ej: 'You are my friend.' },                    // 16
    { en: 'teacher', es: 'profesor, profesora', ej: 'You are my teacher.' },           // 17
    { en: "What's your name?", es: '¿cómo te llamas?', ej: "What's your name? My name is Ana." }, // 18
    { en: 'nice to meet you', es: 'mucho gusto', ej: 'Nice to meet you, Tom!' },       // 19
    { en: 'How are you?', es: '¿cómo estás?', ej: 'Hi! How are you?' },                // 20
    { en: "I'm fine", es: 'estoy bien', ej: "I'm fine, thanks." },                     // 21
    { en: 'and you?', es: '¿y tú?', ej: "I'm fine. And you?" },                        // 22
    { en: 'yes', es: 'sí', ej: 'Yes, please.' },                                       // 23
    { en: 'no', es: 'no', ej: 'No, thanks.' }                                          // 24
  ],

  lecciones: [
    {
      id: 'l1',
      tipo: 'vocab',
      titulo: 'Saludar a cualquier hora',
      sub: '6 saludos, del desayuno a la cama',
      nuevas: [0, 1, 2, 3, 4, 5],
      ejercicios: [
        { tipo: 'opcion', q: '¿Qué significa "hello"?', audio: 'hello', opciones: ['hola', 'adiós', 'buenas noches'], r: 0, di: 'hello', vocabIdx: 0 },
        { tipo: 'parejas', pares: [['hello', 'hola'], ['good morning', 'buenos días'], ['good afternoon', 'buenas tardes'], ['good night', 'buenas noches (al dormir)']] },
        { tipo: 'opcion', q: 'Son las 10 de la mañana y entras a una tienda. ¿Qué dices?', opciones: ['Good morning', 'Good night', 'Good evening'], r: 0, di: 'Good morning', vocabIdx: 2 },
        { tipo: 'opcion', q: 'Te vas a dormir. ¿Qué dices?', opciones: ['Good night', 'Good afternoon', 'Good morning'], r: 0, di: 'Good night', vocabIdx: 5 },
        { tipo: 'opcion', q: 'Llegas a una cena a las 8 de la noche. ¿Cómo saludas?', opciones: ['Good evening', 'Good night', 'Good morning'], r: 0, di: 'Good evening', vocabIdx: 4 },
        { tipo: 'huecos', antes: 'Son las 4 de la tarde: "Good', despues: '!"', opciones: ['afternoon', 'morning', 'evening'], r: 0 },
        { tipo: 'escucha', en: 'good morning' },
        { tipo: 'opcion', q: '"hi" es...', opciones: ['un hola informal', 'un adiós', 'buenas tardes'], r: 0, di: 'hi', vocabIdx: 1 },
        { tipo: 'habla', en: 'Hello! Good morning.', es: 'Hola, buenos días.' }
      ]
    },
    {
      id: 'l2',
      tipo: 'vocab',
      titulo: 'Despedirse y ser amable',
      sub: 'Adiós, gracias, perdón: lo que se usa a cada rato',
      nuevas: [6, 7, 8, 9, 10, 11, 12, 13, 14],
      ejercicios: [
        { tipo: 'parejas', pares: [['goodbye', 'adiós'], ['please', 'por favor'], ['thank you', 'gracias'], ['sorry', 'perdón'], ['excuse me', 'disculpe']] },
        { tipo: 'opcion', q: 'Alguien te dice "Thank you!". ¿Qué respondes?', opciones: ["You're welcome", 'Excuse me', 'Good night'], r: 0, di: "You're welcome", vocabIdx: 12 },
        { tipo: 'traduce', es: 'gracias', en: ['thank you', 'thanks'], vocabIdx: 10 },
        { tipo: 'traduce', es: 'por favor', en: ['please'], vocabIdx: 9 },
        { tipo: 'opcion', q: 'Quieres pasar y hay gente en el camino. ¿Qué dices?', opciones: ['Excuse me', 'Sorry', 'See you later'], r: 0, di: 'Excuse me', vocabIdx: 14 },
        { tipo: 'opcion', q: 'Pisaste a alguien sin querer. ¿Qué dices?', opciones: ['Sorry', 'Please', 'Bye'], r: 0, di: 'Sorry', vocabIdx: 13 },
        { tipo: 'escucha', en: 'See you later!' },
        { tipo: 'ordena', es: 'Nos vemos luego.', en: 'See you later.', extra: ['bye'] },
        { tipo: 'opcion', q: 'La forma informal de decir adiós es...', opciones: ['bye', 'goodbye', 'excuse me'], r: 0, di: 'bye', vocabIdx: 7 },
        { tipo: 'habla', en: 'Thank you very much!', es: 'Muchas gracias.' }
      ]
    },
    {
      id: 'l3',
      tipo: 'gramatica',
      titulo: 'Decir quién eres',
      sub: 'I am, you are y "My name is": tus tres primeras frases',
      nuevas: [15, 16, 17],
      regalos: ['i', 'am', 'you', 'are', 'my', 'your', 'is', "i'm", "you're", 'ana', 'tom', 'dosa'],
      html: `<h2 style="margin-top:0">Tus tres primeras frases</h2>
        <p>Con dos palabras ya te presentas. <b>I am</b> = yo soy; <b>you are</b> = tú eres:</p>
        <table>
          <tr><td><span class="ej">I am Dosa.</span></td><td class="ejta">Yo soy Dosa.</td></tr>
          <tr><td><span class="ej">You are my friend.</span></td><td class="ejta">Tú eres mi amigo.</td></tr>
          <tr><td><span class="ej">My name is Dosa.</span></td><td class="ejta">Mi nombre es Dosa. (o sea: me llamo Dosa)</td></tr>
        </table>
        <p>Al hablar casi siempre se acortan: <span class="ej">I'm Dosa</span> = I am Dosa, y <span class="ej">You're my friend</span> = You are my friend. Las dos formas valen.</p>
        <div class="nota">Dos cosas prácticas: <b>I</b> (yo) se escribe SIEMPRE con mayúscula. Y en inglés no se calla el pronombre: "soy Ana" a secas no existe, siempre es <b>I am Ana</b>.</div>
        <p>Toca cualquier frase de color para escucharla.</p>`,
      ejercicios: [
        { tipo: 'huecos', antes: 'I', despues: 'Dosa.', opciones: ['am', 'are'], r: 0 },
        { tipo: 'huecos', antes: 'You', despues: 'my friend.', opciones: ['are', 'am'], r: 0 },
        { tipo: 'huecos', antes: 'My name', despues: 'Dosa.', opciones: ['is', 'am', 'are'], r: 0 },
        { tipo: 'ordena', es: 'Me llamo Ana.', en: 'My name is Ana.', extra: ['are'] },
        { tipo: 'traduce', es: 'Yo soy Dosa.', en: ['i am dosa', "i'm dosa"] },
        { tipo: 'traduce', es: 'Tú eres mi amigo.', en: ['you are my friend', "you're my friend"], vocabIdx: 16 },
        { tipo: 'opcion', q: '¿Cuál está bien escrita?', opciones: ['I am Ana', 'i am Ana', 'i Am ana'], r: 0, di: 'I am Ana' },
        { tipo: 'escucha', en: 'You are my teacher.' },
        { tipo: 'habla', en: 'My name is Dosa.', es: 'Me llamo Dosa.' }
      ]
    },
    {
      id: 'l4',
      tipo: 'vocab',
      titulo: 'Conocer a alguien',
      sub: 'Preguntar el nombre, preguntar cómo está, responder',
      nuevas: [18, 19, 20, 21, 22, 23, 24],
      ejercicios: [
        { tipo: 'opcion', q: 'Te preguntan: "What\'s your name?" ¿Qué respondes?', audio: "What's your name?", opciones: ['My name is Ana.', "I'm fine.", 'Goodbye!'], r: 0, di: 'My name is Ana', vocabIdx: 18 },
        { tipo: 'opcion', q: 'Te preguntan: "How are you?" ¿Qué respondes?', audio: 'How are you?', opciones: ["I'm fine, thanks.", 'Nice to meet you.', 'My name is Tom.'], r: 0, di: "I'm fine, thanks", vocabIdx: 20 },
        { tipo: 'parejas', pares: [['yes', 'sí'], ['no', 'no'], ['How are you?', '¿cómo estás?'], ['and you?', '¿y tú?']] },
        { tipo: 'ordena', es: '¿Cómo te llamas?', en: "What's your name?", extra: ['am'] },
        { tipo: 'ordena', es: 'Estoy bien, gracias. ¿Y tú?', en: "I'm fine, thanks. And you?" },
        { tipo: 'traduce', es: 'mucho gusto', en: ['nice to meet you'], vocabIdx: 19 },
        { tipo: 'escucha', en: "I'm fine, thanks. And you?" },
        { tipo: 'huecos', antes: "I'm", despues: ', thanks.', opciones: ['fine', 'name', 'yes'], r: 0 },
        { tipo: 'habla', en: 'Nice to meet you!', es: 'Mucho gusto.' },
        { tipo: 'habla', en: 'How are you?', es: '¿Cómo estás?' }
      ]
    },
    {
      id: 'l5',
      tipo: 'practica',
      titulo: 'Combínalo todo',
      sub: 'Todo lo de la unidad, mezclado y produciendo tú',
      ejercicios: [
        { tipo: 'traduce', es: 'Buenos días, profesor.', en: ['good morning, teacher', 'good morning teacher'] },
        { tipo: 'ordena', es: '¡Hola! Me llamo Ana.', en: 'Hello! My name is Ana.', extra: ['are'] },
        { tipo: 'escucha', en: 'Nice to meet you, Tom!' },
        { tipo: 'huecos', antes: 'Hello! My', despues: 'is Tom.', opciones: ['name', 'friend', 'teacher'], r: 0 },
        { tipo: 'huecos', antes: "—Thank you! —You're", despues: '.', opciones: ['welcome', 'fine', 'please'], r: 0 },
        { tipo: 'opcion', q: 'Te dicen: "Nice to meet you!" ¿Qué respondes?', opciones: ['Nice to meet you!', "I'm fine.", 'Good night.'], r: 0, di: 'Nice to meet you!' },
        { tipo: 'ordena', es: '¿Cómo estás, Ana?', en: 'How are you, Ana?' },
        { tipo: 'traduce', es: 'Sí, por favor.', en: ['yes, please', 'yes please'], vocabIdx: 23 },
        { tipo: 'traduce', es: 'No, gracias.', en: ['no, thanks', 'no thanks', 'no, thank you'], vocabIdx: 24 },
        { tipo: 'escucha', en: 'Goodbye, my friend!' },
        { tipo: 'habla', en: 'Hi! My name is Dosa. Nice to meet you!', es: 'Hola, me llamo Dosa. ¡Mucho gusto!' },
        { tipo: 'habla', en: 'See you later, my friend!', es: '¡Nos vemos luego, amigo!' }
      ]
    },
    {
      id: 'l6',
      tipo: 'dialogo',
      titulo: 'Tu primera conversación',
      sub: 'Todo lo de la unidad, junto y de corrido',
      dialogo: {
        titulo: 'Dos personas se conocen',
        lineas: [
          { q: 'A', en: 'Hello! Good morning.', es: 'Hola, buenos días.' },
          { q: 'B', en: 'Hi! How are you?', es: 'Hola, ¿cómo estás?' },
          { q: 'A', en: "I'm fine, thanks. And you?", es: 'Bien, gracias. ¿Y tú?' },
          { q: 'B', en: "I'm fine. What's your name?", es: 'Bien. ¿Cómo te llamas?' },
          { q: 'A', en: 'My name is Ana. And you?', es: 'Me llamo Ana. ¿Y tú?' },
          { q: 'B', en: 'I am Tom. Nice to meet you, Ana!', es: 'Soy Tom. ¡Mucho gusto, Ana!' },
          { q: 'A', en: 'Nice to meet you, Tom!', es: '¡Mucho gusto, Tom!' },
          { q: 'B', en: 'See you later, Ana. Bye!', es: 'Nos vemos luego, Ana. ¡Chau!' },
          { q: 'A', en: 'Goodbye, Tom!', es: '¡Adiós, Tom!' }
        ],
        preguntas: [
          { tipo: 'opcion', q: '¿Cómo se llama ella?', opciones: ['Ana', 'Tom', 'No lo dice'], r: 0 },
          { tipo: 'opcion', q: '¿Qué responde Tom a "How are you?"', opciones: ["I'm fine", 'I am Tom', 'Good morning'], r: 0, di: "I'm fine" },
          { tipo: 'opcion', q: '¿Cómo se despide Tom?', opciones: ['See you later. Bye!', 'Good night!', 'Excuse me!'], r: 0, di: 'See you later. Bye!' }
        ]
      }
    }
  ],

  examen: [
    { tipo: 'opcion', q: 'Son las 4 de la tarde y saludas. ¿Qué dices?', opciones: ['Good afternoon', 'Good morning', 'Good night'], r: 0, di: 'Good afternoon' },
    { tipo: 'opcion', q: 'Te vas a dormir. ¿Qué dices?', opciones: ['Good night', 'Good evening', 'Goodbye'], r: 0, di: 'Good night' },
    { tipo: 'opcion', q: 'Alguien te dice "Thank you!". ¿Qué respondes?', opciones: ["You're welcome", 'Please', 'Sorry'], r: 0, di: "You're welcome" },
    { tipo: 'opcion', q: 'Chocaste con alguien sin querer. ¿Qué dices?', opciones: ['Sorry', 'Excuse me', 'Bye'], r: 0, di: 'Sorry' },
    { tipo: 'huecos', antes: 'I', despues: 'Tom.', opciones: ['am', 'are'], r: 0 },
    { tipo: 'huecos', antes: 'You', despues: 'my teacher.', opciones: ['are', 'am'], r: 0 },
    { tipo: 'huecos', antes: 'My name', despues: 'Ana.', opciones: ['is', 'am', 'are'], r: 0 },
    { tipo: 'traduce', es: 'por favor', en: ['please'] },
    { tipo: 'traduce', es: 'de nada', en: ["you're welcome", 'you are welcome'] },
    { tipo: 'traduce', es: '¿Cómo estás?', en: ['how are you'] },
    { tipo: 'escucha', en: 'Good morning, teacher.' },
    { tipo: 'escucha', en: 'My name is Ana.' },
    { tipo: 'ordena', es: 'Me llamo Tom.', en: 'My name is Tom.', extra: ['are'] },
    { tipo: 'ordena', es: 'Mucho gusto.', en: 'Nice to meet you.' }
  ],

  ensayo: {
    resumen: 'Preséntate en tres o cuatro frases',
    consigna: 'Escribe tu primera presentación en inglés: saluda según la hora, di tu nombre (My name is... o I am...), di cómo estás y despídete. Todo con lo visto en la unidad.',
    min: 15
  }
});
