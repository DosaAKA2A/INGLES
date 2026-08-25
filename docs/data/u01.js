/* Unidad 1 — Hola y adiós. FORMATO PPP (2026-08-25):
   cada lección abre con una ESCENA (el contexto primero), las palabras se
   DESCUBREN con su `uso` (cuándo y por qué), y los ejercicios van en orden
   entiende -> practica -> produce. Los `por` explican la regla en el
   veredicto, aciertes o falles. Nada se pregunta sin haberse enseñado. */
CURSO.push({
  id: 'u01',
  nivel: 'A0',
  titulo: 'Hola y adiós',
  descripcion: 'Al terminar esta unidad puedes saludar, dar las gracias, presentarte y tener tu primera conversación corta.',

  vocab: [
    { en: 'hello', es: 'hola', uso: 'El saludo comodín: vale a cualquier hora y con cualquier persona.', ej: 'Hello, Ana!' },                     // 0
    { en: 'hi', es: 'hola (informal)', uso: 'Entre amigos o gente de confianza. Más suelto que hello.', ej: 'Hi, Tom!' },                        // 1
    { en: 'good morning', es: 'buenos días', uso: 'Desde que amanece hasta el mediodía.', ej: 'Good morning!' },                                  // 2
    { en: 'good afternoon', es: 'buenas tardes', uso: 'Del mediodía a la caída del sol.', ej: 'Good afternoon!' },                               // 3
    { en: 'good evening', es: 'buenas noches (al llegar)', uso: 'De noche, para SALUDAR al llegar a un sitio.', ej: 'Good evening!' },           // 4
    { en: 'good night', es: 'buenas noches (al despedirse)', uso: 'Solo para DESPEDIRSE antes de dormir. No es un saludo.', ej: 'Good night!' }, // 5
    { en: 'goodbye', es: 'adiós', uso: 'La despedida de siempre, sirve con todo el mundo.', ej: 'Goodbye, Ana!' },                                // 6
    { en: 'bye', es: 'adiós (informal)', uso: 'La despedida corta, entre amigos.', ej: 'Bye, Tom!' },                                            // 7
    { en: 'see you later', es: 'nos vemos luego', uso: 'Cuando sabes que se volverán a ver.', ej: 'See you later!' },                            // 8
    { en: 'please', es: 'por favor', uso: 'Se añade SIEMPRE al pedir algo; sin ella la frase suena a orden.', ej: 'Coffee, please.' },           // 9
    { en: 'thank you', es: 'gracias', uso: 'Para agradecer, en cualquier situación.', ej: 'Thank you very much.' },                              // 10
    { en: 'thanks', es: 'gracias (informal)', uso: 'La forma corta, entre amigos.', ej: 'Thanks, Ana!' },                                        // 11
    { en: "you're welcome", es: 'de nada', uso: 'La respuesta fija cuando te dan las gracias.', nota: "Forma corta de <b>you are welcome</b>. En inglés, <b>you are</b> casi siempre se acorta a <b>you're</b> al hablar.", ej: "Thanks! You're welcome." }, // 12
    { en: 'sorry', es: 'perdón, lo siento', uso: 'Cuando YA hiciste algo: chocar, pisar, equivocarte.', ej: 'Sorry!' },                          // 13
    { en: 'excuse me', es: 'disculpe', uso: 'ANTES de molestar: llamar la atención o pedir paso. Esa es la diferencia con sorry.', ej: 'Excuse me!' }, // 14
    { en: 'name', es: 'nombre', uso: 'La palabra clave para presentarte: my name is...', ej: 'My name is {TU}.' },                               // 15
    { en: 'friend', es: 'amigo, amiga', uso: 'Vale para amigo y amiga: en inglés no cambia.', ej: 'You are my friend.' },                        // 16
    { en: 'teacher', es: 'profesor, profesora', uso: 'También vale para los dos: el inglés casi no marca el género.', ej: 'You are my teacher.' }, // 17
    { en: "What's your name?", es: '¿cómo te llamas?', uso: "LA pregunta para conocer a alguien. Se responde con my name is... o I'm...", nota: "Forma corta de <b>what is your name?</b> — <b>what is</b> se acorta a <b>what's</b>.", ej: "What's your name? My name is Ana." }, // 18
    { en: 'nice to meet you', es: 'mucho gusto', uso: 'Solo la PRIMERA vez que ves a alguien. Se responde igual: nice to meet you.', ej: 'Nice to meet you, Tom!' }, // 19
    { en: 'How are you?', es: '¿cómo estás?', uso: 'El saludo-pregunta de cortesía. Se responde corto y se devuelve con and you?', ej: 'Hi! How are you?' }, // 20
    { en: "I'm fine", es: 'estoy bien', uso: 'La respuesta de siempre a how are you?, aunque el día vaya regular.', nota: "Forma corta de <b>I am fine</b>. <b>I am</b> se acorta a <b>I'm</b>.", ej: "I'm fine, thanks." }, // 21
    { en: 'and you?', es: '¿y tú?', uso: 'Devuelve la pregunta y mantiene viva la conversación.', ej: "I'm fine. And you?" },                    // 22
    { en: 'yes', es: 'sí', uso: 'Con please queda amable: yes, please.', ej: 'Yes, please.' },                                                    // 23
    { en: 'no', es: 'no', uso: 'Con thanks queda amable: no, thanks.', ej: 'No, thanks.' }                                                        // 24
  ],

  lecciones: [
    {
      id: 'l1',
      tipo: 'vocab',
      titulo: 'Saludar a cualquier hora',
      sub: 'Un día entero de saludos',
      escena: {
        titulo: 'Un día entero de saludos',
        lugar: 'Ana y Tom trabajan juntos. Escucha cómo cambia el saludo según la hora.',
        lineas: [
          { t: 'Por la mañana' },
          { q: 'A', en: 'Hello! Good morning!', es: '¡Hola! ¡Buenos días!' },
          { q: 'B', en: 'Hi, Ana! Good morning!', es: '¡Hola, Ana! ¡Buenos días!' },
          { t: 'Después del almuerzo' },
          { q: 'A', en: 'Good afternoon, Tom!', es: '¡Buenas tardes, Tom!' },
          { q: 'B', en: 'Good afternoon!', es: '¡Buenas tardes!' },
          { t: 'Al llegar a una cena' },
          { q: 'A', en: 'Good evening!', es: '¡Buenas noches! (llegando)' },
          { t: 'Y al irse a dormir' },
          { q: 'B', en: 'Good night, Ana!', es: '¡Buenas noches, Ana! (despidiéndose)' }
        ]
      },
      nuevas: [0, 1, 2, 3, 4, 5],
      entiende: [
        { tipo: 'opcion', q: 'En la escena, ¿qué dicen al LLEGAR a la cena?', opciones: ['Good evening', 'Good night', 'Good morning'], r: 0, di: 'Good evening', vocabIdx: 4,
          por: '<b>Good evening</b> saluda al llegar de noche; <b>good night</b> solo despide antes de dormir.' },
        { tipo: 'opcion', q: 'Tom dice "Hi, Ana!" y no "Hello". ¿Por qué?', opciones: ['Son amigos: hi es la forma cercana', 'Hi es más formal', 'Hi significa adiós'], r: 0, di: 'hi', vocabIdx: 1,
          por: '<b>Hi</b> y <b>hello</b> significan lo mismo; hi es la versión suelta, de confianza.' },
        { tipo: 'opcion', q: '¿Qué significa "Good morning"?', audio: 'good morning', opciones: ['buenos días', 'buenas tardes', 'buenas noches'], r: 0, di: 'good morning', vocabIdx: 2,
          por: '<b>Morning</b> es la mañana: desde que amanece hasta el mediodía.' }
      ],
      practica: [
        { tipo: 'parejas', pares: [['hello', 'hola'], ['good morning', 'buenos días'], ['good afternoon', 'buenas tardes'], ['good night', 'buenas noches (al dormir)']] },
        { tipo: 'opcion', q: 'Son las 10 de la mañana y entras a una tienda. ¿Qué dices?', opciones: ['Good morning', 'Good night', 'Good evening'], r: 0, di: 'Good morning', vocabIdx: 2,
          por: 'Hasta el mediodía, siempre <b>good morning</b>.' },
        { tipo: 'huecos', antes: 'Son las 4 de la tarde: "Good', despues: '!"', opciones: ['afternoon', 'morning', 'evening'], r: 0,
          por: '<b>Afternoon</b> cubre del mediodía a la caída del sol.' },
        { tipo: 'opcion', q: 'Te vas a dormir. ¿Qué dices?', opciones: ['Good night', 'Good evening', 'Good morning'], r: 0, di: 'Good night', vocabIdx: 5,
          por: '<b>Good night</b> no saluda: despide. Para llegar de noche es good evening.' },
        { tipo: 'escucha', en: 'good morning' }
      ],
      produce: [
        { tipo: 'ordena', es: '¡Hola! ¡Buenos días!', en: 'Hello! Good morning!', extra: ['night'] },
        { tipo: 'habla', en: 'Hello! Good morning.', es: 'Hola, buenos días.' }
      ]
    },

    {
      id: 'l2',
      tipo: 'vocab',
      titulo: 'Pedir y agradecer',
      sub: 'Por favor, gracias, perdón: lo que se usa a cada rato',
      escena: {
        titulo: 'En la cafetería',
        lugar: 'Ana pide un café. Fíjate qué dice antes de molestar, al pedir y al agradecer.',
        lineas: [
          { q: 'A', en: 'Excuse me... coffee, please.', es: 'Disculpe... un café, por favor.' },
          { q: 'B', en: 'Coffee!', es: '¡Un café!' },
          { q: 'A', en: 'Thank you very much!', es: '¡Muchas gracias!' },
          { q: 'B', en: "You're welcome!", es: '¡De nada!' },
          { t: 'A la salida, Ana tropieza con alguien' },
          { q: 'A', en: 'Oh, sorry!', es: '¡Ay, perdón!' },
          { t: 'Y se despide' },
          { q: 'A', en: 'Bye! See you later!', es: '¡Adiós! ¡Nos vemos luego!' },
          { q: 'B', en: 'Goodbye!', es: '¡Adiós!' }
        ]
      },
      nuevas: [6, 7, 8, 9, 10, 11, 12, 13, 14],
      entiende: [
        { tipo: 'opcion', q: 'En la escena, ¿qué dice Ana ANTES de pedir el café?', opciones: ['Excuse me', 'Sorry', 'Goodbye'], r: 0, di: 'Excuse me', vocabIdx: 14,
          por: '<b>Excuse me</b> va ANTES de molestar. <b>Sorry</b> va después, cuando ya pasó algo.' },
        { tipo: 'opcion', q: 'Ana da las gracias. ¿Qué responde el camarero?', opciones: ["You're welcome", 'Excuse me', 'Good night'], r: 0, di: "You're welcome", vocabIdx: 12,
          por: "A un <b>thank you</b> se responde <b>you're welcome</b>. Es un par fijo." },
        { tipo: 'opcion', q: 'Ana tropieza con alguien. ¿Qué dice?', opciones: ['Sorry', 'Please', 'Thanks'], r: 0, di: 'Sorry', vocabIdx: 13,
          por: 'El daño ya está hecho: eso es <b>sorry</b>.' }
      ],
      practica: [
        { tipo: 'parejas', pares: [['goodbye', 'adiós'], ['please', 'por favor'], ['thank you', 'gracias'], ['sorry', 'perdón'], ['excuse me', 'disculpe']] },
        { tipo: 'opcion', q: 'Quieres pasar y hay gente en el camino. ¿Qué dices?', opciones: ['Excuse me', 'Sorry', 'See you later'], r: 0, di: 'Excuse me', vocabIdx: 14,
          por: 'Todavía no molestaste a nadie: pides permiso con <b>excuse me</b>.' },
        { tipo: 'opcion', q: 'Pisaste a alguien sin querer. ¿Qué dices?', opciones: ['Sorry', 'Please', 'Bye'], r: 0, di: 'Sorry', vocabIdx: 13,
          por: 'Ya pasó: <b>sorry</b>. Si fuera antes de molestar, sería excuse me.' },
        { tipo: 'huecos', antes: 'Pides un café: "Coffee,', despues: '!"', opciones: ['please', 'sorry', 'welcome'], r: 0,
          por: 'Sin <b>please</b>, "coffee" suena a orden. Con please, a petición.' },
        { tipo: 'escucha', en: 'See you later!' },
        { tipo: 'traduce', es: 'gracias', en: ['thank you', 'thanks'], vocabIdx: 10 }
      ],
      produce: [
        { tipo: 'ordena', es: 'Nos vemos luego.', en: 'See you later.', extra: ['bye'] },
        { tipo: 'traduce', es: 'Un café, por favor.', en: ['coffee, please', 'coffee please'], vocabIdx: 9,
          por: 'En inglés basta la cosa + <b>please</b>: coffee, please.' },
        { tipo: 'habla', en: 'Thank you very much!', es: 'Muchas gracias.' }
      ]
    },

    {
      id: 'l3',
      tipo: 'gramatica',
      titulo: 'Decir quién eres',
      sub: 'I am, you are y "my name is": tus tres primeras frases',
      escena: {
        titulo: 'Primer día de clase',
        lugar: 'Ana conoce a su profesor. Fíjate en I am (yo soy) y you are (tú eres).',
        lineas: [
          { q: 'A', en: 'Hello! I am Ana.', es: '¡Hola! Yo soy Ana.' },
          { q: 'B', en: 'Hi, Ana! My name is Tom.', es: '¡Hola, Ana! Mi nombre es Tom.' },
          { q: 'A', en: 'You are my teacher!', es: '¡Tú eres mi profesor!' },
          { q: 'B', en: 'I am your teacher, Ana.', es: 'Soy tu profesor, Ana.' }
        ]
      },
      nuevas: [15, 16, 17],
      regalos: ['i', 'am', 'you', 'are', 'my', 'your', 'is', "i'm", "you're", 'ana', 'tom', 'dosa'],
      html: `<h2 style="margin-top:0">Tus tres primeras frases</h2>
        <p>En la escena lo acabas de oír. <b>I am</b> = yo soy; <b>you are</b> = tú eres:</p>
        <table>
          <tr><td><span class="ej">I am {TU}.</span></td><td class="ejta">Yo soy {TU}.</td></tr>
          <tr><td><span class="ej">You are my friend.</span></td><td class="ejta">Tú eres mi amigo.</td></tr>
          <tr><td><span class="ej">My name is {TU}.</span></td><td class="ejta">Mi nombre es {TU}. (o sea: me llamo {TU})</td></tr>
        </table>
        <p><b>¿Por qué am, are, is?</b> En inglés cada persona tiene su forma del verbo ser, y no se mezclan: <b>I</b> va siempre con <b>am</b>, <b>you</b> va siempre con <b>are</b>, y una cosa (como tu nombre) va con <b>is</b>.</p>
        <p>Al hablar casi siempre se acortan: <span class="ej">I'm {TU}</span> = I am {TU}, y <span class="ej">You're my friend</span> = You are my friend. Las dos formas valen.</p>
        <div class="nota">Dos cosas prácticas: <b>I</b> (yo) se escribe SIEMPRE con mayúscula, vaya donde vaya. Y en inglés el pronombre no se calla: "soy Ana" a secas no existe, siempre es <b>I am Ana</b>.</div>
        <p>Toca cualquier frase de color para escucharla.</p>`,
      entiende: [
        { tipo: 'opcion', q: 'En la escena, ¿quién es el profesor?', opciones: ['Tom', 'Ana', 'No se dice'], r: 0,
          por: 'Tom dice <b>I am your teacher</b>: yo soy tu profesor.' },
        { tipo: 'opcion', q: '"I am Ana" significa...', opciones: ['Yo soy Ana', 'Tú eres Ana', 'Ella es Ana'], r: 0, di: 'I am Ana',
          por: '<b>I</b> = yo. Por eso va con <b>am</b>.' }
      ],
      practica: [
        { tipo: 'huecos', antes: 'I', despues: '{TU}.', opciones: ['am', 'are'], r: 0,
          por: '<b>I</b> va siempre con <b>am</b>. Are es de you.' },
        { tipo: 'huecos', antes: 'You', despues: 'my friend.', opciones: ['are', 'am'], r: 0,
          por: '<b>You</b> va siempre con <b>are</b>. Am es de I.' },
        { tipo: 'huecos', antes: 'My name', despues: '{TU}.', opciones: ['is', 'am', 'are'], r: 0,
          por: 'Tu nombre es una cosa, no una persona: las cosas van con <b>is</b>.' },
        { tipo: 'opcion', q: '¿Cuál está bien escrita?', opciones: ['I am Ana', 'i am Ana', 'i Am ana'], r: 0, di: 'I am Ana',
          por: '<b>I</b> (yo) lleva mayúscula SIEMPRE, esté donde esté en la frase.' },
        { tipo: 'escucha', en: 'You are my teacher.' }
      ],
      produce: [
        { tipo: 'ordena', es: 'Me llamo Ana.', en: 'My name is Ana.', extra: ['are'] },
        { tipo: 'traduce', es: 'Yo soy {TU}.', en: ['i am dosa', "i'm dosa"],
          por: "Valen las dos: <b>I am</b> y su forma corta <b>I'm</b>." },
        { tipo: 'traduce', es: 'Tú eres mi amigo.', en: ['you are my friend', "you're my friend"], vocabIdx: 16 },
        { tipo: 'habla', en: 'My name is {TU}.', es: 'Me llamo {TU}.' }
      ]
    },

    {
      id: 'l4',
      tipo: 'vocab',
      titulo: 'Conocer a alguien',
      sub: 'Preguntar el nombre, preguntar cómo está, responder',
      escena: {
        titulo: 'En una fiesta',
        lugar: 'Dos desconocidos se presentan. Esta escena es EL guion de conocer a alguien.',
        lineas: [
          { q: 'A', en: 'Good evening!', es: '¡Buenas noches!' },
          { q: 'B', en: "Hi! What's your name?", es: '¡Hola! ¿Cómo te llamas?' },
          { q: 'A', en: 'My name is Ana. And you?', es: 'Me llamo Ana. ¿Y tú?' },
          { q: 'B', en: "I'm Tom. Nice to meet you!", es: 'Soy Tom. ¡Mucho gusto!' },
          { q: 'A', en: 'Nice to meet you, Tom! How are you?', es: '¡Mucho gusto, Tom! ¿Cómo estás?' },
          { q: 'B', en: "I'm fine, thanks. And you?", es: 'Bien, gracias. ¿Y tú?' },
          { q: 'A', en: "I'm fine!", es: '¡Bien!' }
        ]
      },
      nuevas: [18, 19, 20, 21, 22, 23, 24],
      entiende: [
        { tipo: 'opcion', q: 'En la escena, ¿qué pregunta Tom para saber el nombre?', audio: "What's your name?", opciones: ["What's your name?", 'How are you?', 'And you?'], r: 0, di: "What's your name?", vocabIdx: 18,
          por: "<b>What's your name?</b> pregunta el nombre; <b>how are you?</b> pregunta cómo estás." },
        { tipo: 'opcion', q: '¿Qué responde Tom a "How are you?"', opciones: ["I'm fine, thanks. And you?", 'My name is Tom.', 'Nice to meet you.'], r: 0, di: "I'm fine, thanks. And you?", vocabIdx: 21,
          por: "A <b>how are you?</b> se responde corto (<b>I'm fine</b>) y se devuelve con <b>and you?</b>" },
        { tipo: 'opcion', q: '"Nice to meet you" se dice...', opciones: ['la primera vez que conoces a alguien', 'cada mañana', 'al despedirse'], r: 0, di: 'nice to meet you', vocabIdx: 19,
          por: 'Solo en el primer encuentro. Y se responde igual: <b>nice to meet you</b>.' }
      ],
      practica: [
        { tipo: 'parejas', pares: [['yes', 'sí'], ['no', 'no'], ['How are you?', '¿cómo estás?'], ['and you?', '¿y tú?']] },
        { tipo: 'opcion', q: 'Te preguntan: "What\'s your name?" ¿Qué respondes?', audio: "What's your name?", opciones: ['My name is Ana.', "I'm fine.", 'Goodbye!'], r: 0, di: 'My name is Ana', vocabIdx: 18,
          por: 'Te preguntan el NOMBRE: respondes con <b>my name is...</b>' },
        { tipo: 'huecos', antes: "I'm", despues: ', thanks.', opciones: ['fine', 'name', 'yes'], r: 0,
          por: "<b>I'm fine</b> = estoy bien. La respuesta de cortesía de siempre." },
        { tipo: 'escucha', en: "I'm fine, thanks. And you?" }
      ],
      produce: [
        { tipo: 'ordena', es: '¿Cómo te llamas?', en: "What's your name?", extra: ['am'] },
        { tipo: 'ordena', es: 'Estoy bien, gracias. ¿Y tú?', en: "I'm fine, thanks. And you?" },
        { tipo: 'traduce', es: 'mucho gusto', en: ['nice to meet you'], vocabIdx: 19 },
        { tipo: 'habla', en: 'Nice to meet you!', es: 'Mucho gusto.' },
        { tipo: 'habla', en: 'How are you?', es: '¿Cómo estás?' }
      ]
    },

    {
      id: 'l5',
      tipo: 'practica',
      titulo: 'Combínalo todo',
      sub: 'Todo lo de la unidad, cada vez más tuyo',
      practica: [
        { tipo: 'huecos', antes: 'Hello! My', despues: 'is Tom.', opciones: ['name', 'friend', 'teacher'], r: 0 },
        { tipo: 'huecos', antes: "—Thank you! —You're", despues: '.', opciones: ['welcome', 'fine', 'please'], r: 0,
          por: "El par fijo: thank you -> <b>you're welcome</b>." },
        { tipo: 'opcion', q: 'Te dicen: "Nice to meet you!" ¿Qué respondes?', opciones: ['Nice to meet you!', "I'm fine.", 'Good night.'], r: 0, di: 'Nice to meet you!',
          por: 'Se responde con la misma frase, devuelta.' },
        { tipo: 'escucha', en: 'Nice to meet you, Tom!' },
        { tipo: 'escucha', en: 'Goodbye, my friend!' }
      ],
      produce: [
        { tipo: 'traduce', es: 'Buenos días, profesor.', en: ['good morning, teacher', 'good morning teacher'] },
        { tipo: 'ordena', es: '¡Hola! Me llamo Ana.', en: 'Hello! My name is Ana.', extra: ['are'] },
        { tipo: 'ordena', es: '¿Cómo estás, Ana?', en: 'How are you, Ana?' },
        { tipo: 'traduce', es: 'Sí, por favor.', en: ['yes, please', 'yes please'], vocabIdx: 23,
          por: 'El <b>please</b> convierte el sí seco en un sí amable.' },
        { tipo: 'traduce', es: 'No, gracias.', en: ['no, thanks', 'no thanks', 'no, thank you'], vocabIdx: 24,
          por: 'Igual que yes, please: el <b>thanks</b> suaviza el no.' },
        { tipo: 'habla', en: 'Hi! My name is {TU}. Nice to meet you!', es: 'Hola, me llamo {TU}. ¡Mucho gusto!' },
        { tipo: 'habla', en: 'See you later, my friend!', es: '¡Nos vemos luego, amigo!' }
      ]
    },

    {
      id: 'l6',
      tipo: 'dialogo',
      titulo: 'Tu primera conversación',
      sub: 'Ahora te hablan a ti: responde tú',
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
          { q: 'B', en: 'See you later, Ana. Bye!', es: 'Nos vemos luego, Ana. ¡Adiós!' },
          { q: 'A', en: 'Goodbye, Tom!', es: '¡Adiós, Tom!' }
        ],
        preguntas: [
          { tipo: 'opcion', q: 'Te dicen: "Hello! How are you?" ¿Qué respondes?', audio: 'Hello! How are you?', opciones: ["I'm fine, thanks. And you?", 'My name is Ana.', 'Good night.'], r: 0, di: "I'm fine, thanks. And you?", fase: 'produce',
            por: 'Respondes corto y devuelves la pregunta: así sigue la conversación.' },
          { tipo: 'ordena', es: 'Te preguntan tu nombre. Responde: "Me llamo {TU}."', en: 'My name is {TU}.', extra: ['are'], fase: 'produce' },
          { tipo: 'opcion', q: 'Te dicen: "Nice to meet you!" ¿Qué respondes?', audio: 'Nice to meet you!', opciones: ['Nice to meet you!', "You're welcome.", 'Sorry!'], r: 0, di: 'Nice to meet you!', fase: 'produce',
            por: 'El primer encuentro se cierra con la misma frase, devuelta.' },
          { tipo: 'habla', en: 'See you later. Bye!', es: 'Despídete: nos vemos luego, adiós.', fase: 'produce' }
        ]
      }
    }
  ],

  examen: [
    { tipo: 'opcion', q: 'Son las 4 de la tarde y saludas. ¿Qué dices?', opciones: ['Good afternoon', 'Good morning', 'Good night'], r: 0, di: 'Good afternoon',
      por: 'La tarde va del mediodía a la caída del sol: <b>good afternoon</b>.' },
    { tipo: 'opcion', q: 'Te vas a dormir. ¿Qué dices?', opciones: ['Good night', 'Good evening', 'Goodbye'], r: 0, di: 'Good night',
      por: '<b>Good night</b> es la despedida de antes de dormir.' },
    { tipo: 'opcion', q: 'Alguien te dice "Thank you!". ¿Qué respondes?', opciones: ["You're welcome", 'Please', 'Sorry'], r: 0, di: "You're welcome",
      por: "El par fijo: thank you -> <b>you're welcome</b>." },
    { tipo: 'opcion', q: 'Chocaste con alguien sin querer. ¿Qué dices?', opciones: ['Sorry', 'Excuse me', 'Bye'], r: 0, di: 'Sorry',
      por: 'Ya pasó: <b>sorry</b>. Excuse me es para ANTES de molestar.' },
    { tipo: 'huecos', antes: 'I', despues: 'Tom.', opciones: ['am', 'are'], r: 0,
      por: '<b>I</b> va siempre con <b>am</b>.' },
    { tipo: 'huecos', antes: 'You', despues: 'my teacher.', opciones: ['are', 'am'], r: 0,
      por: '<b>You</b> va siempre con <b>are</b>.' },
    { tipo: 'huecos', antes: 'My name', despues: 'Ana.', opciones: ['is', 'am', 'are'], r: 0,
      por: 'El nombre es una cosa: va con <b>is</b>.' },
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
