/* Unidad 1 — Saludos y presentaciones */
CURSO.push({
  id: 'u01',
  nivel: 'A0',
  titulo: 'Hola y adiós',
  descripcion: 'Saludar, despedirte y presentarte: lo primero que se dice en cualquier conversación.',

  vocab: [
    { en: 'hello', es: 'hola', ej: 'Hello, Ana!' },
    { en: 'hi', es: 'hola (informal)', ej: 'Hi! How are you?' },
    { en: 'good morning', es: 'buenos días', ej: 'Good morning, teacher.' },
    { en: 'good afternoon', es: 'buenas tardes', ej: 'Good afternoon, everyone.' },
    { en: 'good evening', es: 'buenas noches (al llegar)', ej: 'Good evening, sir.' },
    { en: 'good night', es: 'buenas noches (al despedirse)', ej: 'Good night, see you tomorrow.' },
    { en: 'goodbye', es: 'adiós', ej: 'Goodbye, my friend.' },
    { en: 'bye', es: 'chau (informal)', ej: 'Bye! See you!' },
    { en: 'see you later', es: 'nos vemos luego', ej: 'Bye, see you later!' },
    { en: 'please', es: 'por favor', ej: 'One coffee, please.' },
    { en: 'thank you', es: 'gracias', ej: 'Thank you very much.' },
    { en: 'thanks', es: 'gracias (informal)', ej: 'Thanks, Tom!' },
    { en: "you're welcome", es: 'de nada', ej: "Thanks! You're welcome." },
    { en: 'sorry', es: 'perdón, lo siento', ej: 'Sorry, I am late.' },
    { en: 'excuse me', es: 'disculpe', ej: 'Excuse me, where is the bank?' },
    { en: 'yes', es: 'sí', ej: 'Yes, please.' },
    { en: 'no', es: 'no', ej: 'No, thank you.' },
    { en: 'name', es: 'nombre', ej: 'My name is Dosa.' },
    { en: 'nice to meet you', es: 'mucho gusto', ej: 'Hi, Ana. Nice to meet you.' },
    { en: 'How are you?', es: 'cómo estás', ej: 'Hi, John! How are you?' },
    { en: "I'm fine", es: 'estoy bien', ej: "I'm fine, thanks." },
    { en: 'and you?', es: 'y tú?', ej: "I'm fine, and you?" },
    { en: 'friend', es: 'amigo, amiga', ej: 'Tom is my friend.' },
    { en: 'teacher', es: 'profesor, profesora', ej: 'Good morning, teacher.' }
  ],

  gramatica: [
    {
      titulo: 'I am / you are: decir quién eres',
      html: `<p>En inglés casi nunca se deja caer el pronombre como en español ("soy Ana"). Siempre se dice quién:</p>
        <table>
          <tr><th>Inglés</th><th>Español</th></tr>
          <tr><td><span class="ej">I am Dosa.</span></td><td class="ejta">Yo soy Dosa.</td></tr>
          <tr><td><span class="ej">You are my friend.</span></td><td class="ejta">Tú eres mi amigo.</td></tr>
          <tr><td><span class="ej">I am fine.</span></td><td class="ejta">Estoy bien.</td></tr>
        </table>
        <p>En conversación se acorta: <span class="ej">I'm Dosa</span> = I am Dosa, y <span class="ej">You're my friend</span> = You are my friend. Las dos formas valen; la corta es la normal al hablar.</p>
        <div class="nota">El pronombre <b>I</b> (yo) se escribe SIEMPRE con mayúscula, esté donde esté en la frase: "Tom and I are friends."</div>
        <p>Toca cualquier frase azul para escucharla.</p>`
    },
    {
      titulo: 'Presentarse y preguntar el nombre',
      html: `<p>La pregunta y la respuesta que vas a usar toda la vida:</p>
        <table>
          <tr><td><span class="ej">What's your name?</span></td><td class="ejta">¿Cómo te llamas?</td></tr>
          <tr><td><span class="ej">My name is Dosa.</span></td><td class="ejta">Me llamo Dosa.</td></tr>
          <tr><td><span class="ej">I'm Dosa.</span></td><td class="ejta">Soy Dosa. (más corto, igual de común)</td></tr>
          <tr><td><span class="ej">Nice to meet you.</span></td><td class="ejta">Mucho gusto.</td></tr>
        </table>
        <p>Y para saludar de verdad, no solo "hello":</p>
        <table>
          <tr><td><span class="ej">How are you?</span></td><td class="ejta">¿Cómo estás?</td></tr>
          <tr><td><span class="ej">I'm fine, thanks. And you?</span></td><td class="ejta">Bien, gracias. ¿Y tú?</td></tr>
        </table>
        <div class="nota"><b>good evening</b> y <b>good night</b> no son lo mismo: evening es al LLEGAR de noche (saludo) y night es al IRSE a dormir o despedirse. Si entras a un lugar de noche y dices "good night", estás diciendo chau.</div>`
    }
  ],

  dialogo: {
    titulo: 'Dos personas se conocen',
    lineas: [
      { q: 'A', en: 'Hello! Good morning.', es: 'Hola, buenos días.' },
      { q: 'B', en: 'Hi! How are you?', es: 'Hola, ¿cómo estás?' },
      { q: 'A', en: "I'm fine, thanks. And you?", es: 'Bien, gracias. ¿Y tú?' },
      { q: 'B', en: "I'm fine. What's your name?", es: 'Bien. ¿Cómo te llamas?' },
      { q: 'A', en: 'My name is Ana. And you?', es: 'Me llamo Ana. ¿Y tú?' },
      { q: 'B', en: "I'm Tom. Nice to meet you, Ana.", es: 'Soy Tom. Mucho gusto, Ana.' },
      { q: 'A', en: 'Nice to meet you too!', es: 'Mucho gusto también.' },
      { q: 'B', en: 'Sorry, I am late. Goodbye!', es: 'Perdón, voy tarde. ¡Adiós!' },
      { q: 'A', en: 'Bye! See you later!', es: '¡Chau! ¡Nos vemos luego!' }
    ],
    preguntas: [
      { tipo: 'opcion', q: '¿Cómo se llama ella?', opciones: ['Ana', 'Tom', 'No lo dice'], r: 0 },
      { tipo: 'opcion', q: '¿Qué responde Tom a "How are you?"', opciones: ["I'm Tom", "I'm fine", 'Good morning'], r: 1, di: "I'm fine" },
      { tipo: 'opcion', q: '¿Por qué se despide Tom?', opciones: ['Está cansado', 'Va tarde', 'No le cae bien Ana'], r: 1 }
    ]
  },

  ejercicios: [
    { tipo: 'parejas', pares: [['hello', 'hola'], ['goodbye', 'adiós'], ['please', 'por favor'], ['thank you', 'gracias'], ['sorry', 'perdón']] },
    { tipo: 'opcion', q: 'Entras a una tienda a las 10 de la mañana. ¿Qué dices?', opciones: ['Good night', 'Good morning', 'Good evening'], r: 1, di: 'Good morning' },
    { tipo: 'opcion', q: 'Te vas a dormir. ¿Qué dices?', opciones: ['Good night', 'Good afternoon', 'Good morning'], r: 0, di: 'Good night' },
    { tipo: 'huecos', antes: 'My name', despues: 'Dosa.', opciones: ['is', 'am', 'are'], r: 0 },
    { tipo: 'huecos', antes: 'I', despues: 'fine, thanks.', opciones: ['is', 'am', 'are'], r: 1 },
    { tipo: 'huecos', antes: 'You', despues: 'my friend.', opciones: ['is', 'am', 'are'], r: 2 },
    { tipo: 'traduce', es: 'Gracias', en: ['thank you', 'thanks'], vocabIdx: 10 },
    { tipo: 'traduce', es: 'Mucho gusto', en: ['nice to meet you'], vocabIdx: 18 },
    { tipo: 'traduce', es: 'Me llamo Ana.', en: ['my name is ana', 'i am ana'], vocabIdx: 17 },
    { tipo: 'escucha', en: 'How are you?' },
    { tipo: 'escucha', en: 'Nice to meet you.' },
    { tipo: 'ordena', es: '¿Cómo te llamas?', en: "What's your name?", extra: ['am'] },
    { tipo: 'ordena', es: 'Estoy bien, gracias. ¿Y tú?', en: "I'm fine, thanks. And you?" },
    { tipo: 'habla', en: 'Hello! My name is Dosa.', es: 'Hola, me llamo Dosa.' },
    { tipo: 'habla', en: 'Nice to meet you.', es: 'Mucho gusto.' },
    { tipo: 'opcion', q: 'Alguien te dice "Thank you!". ¿Qué respondes?', opciones: ["You're welcome", 'Excuse me', 'Good night'], r: 0, di: "You're welcome" },
    { tipo: 'opcion', q: 'Quieres pasar y hay gente en el camino. ¿Qué dices?', opciones: ['Sorry, I am late', 'Excuse me', 'See you later'], r: 1, di: 'Excuse me' }
  ],

  examen: [
    { tipo: 'opcion', q: '¿Cuál es el saludo para la tarde?', opciones: ['Good morning', 'Good afternoon', 'Good night'], r: 1, di: 'Good afternoon' },
    { tipo: 'huecos', antes: 'I', despues: 'Dosa.', opciones: ['am', 'is', 'are'], r: 0 },
    { tipo: 'huecos', antes: 'You', despues: 'my teacher.', opciones: ['am', 'is', 'are'], r: 2 },
    { tipo: 'traduce', es: 'Por favor', en: ['please'] },
    { tipo: 'traduce', es: 'De nada', en: ["you're welcome", 'you are welcome'] },
    { tipo: 'traduce', es: '¿Cómo estás?', en: ['how are you'] },
    { tipo: 'escucha', en: 'Good morning, teacher.' },
    { tipo: 'escucha', en: "I'm fine, and you?" },
    { tipo: 'ordena', es: 'Me llamo Tom.', en: 'My name is Tom.', extra: ['are'] },
    { tipo: 'ordena', es: 'Mucho gusto también.', en: 'Nice to meet you too.' },
    { tipo: 'opcion', q: 'Sales de la casa de un amigo de noche. ¿Qué dices?', opciones: ['Good evening', 'Good night', 'Good afternoon'], r: 1, di: 'Good night' },
    { tipo: 'opcion', q: 'Llegaste tarde. ¿Qué dices?', opciones: ['Sorry', 'Please', 'Yes'], r: 0, di: 'Sorry' },
    { tipo: 'opcion', q: '"See you later" significa:', opciones: ['Hasta nunca', 'Nos vemos luego', 'Buenas noches'], r: 1, di: 'See you later' }
  ],

  ensayo: {
    resumen: 'Preséntate en tres o cuatro frases',
    consigna: 'Escribe un mini diálogo o una presentación: saluda, di tu nombre, di cómo estás y despídete. Usa lo de esta unidad.',
    min: 15
  }
});
