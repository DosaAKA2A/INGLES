/* Unidad 2 — Números y edad */
CURSO.push({
  id: 'u02',
  nivel: 'A0',
  titulo: 'Los números',
  descripcion: 'Contar del 0 al 100, decir tu edad y dar tu número de teléfono.',

  vocab: [
    { en: 'zero', es: 'cero' },
    { en: 'one', es: 'uno' },
    { en: 'two', es: 'dos' },
    { en: 'three', es: 'tres' },
    { en: 'four', es: 'cuatro' },
    { en: 'five', es: 'cinco' },
    { en: 'six', es: 'seis' },
    { en: 'seven', es: 'siete' },
    { en: 'eight', es: 'ocho' },
    { en: 'nine', es: 'nueve' },
    { en: 'ten', es: 'diez' },
    { en: 'eleven', es: 'once' },
    { en: 'twelve', es: 'doce' },
    { en: 'thirteen', es: 'trece' },
    { en: 'fifteen', es: 'quince' },
    { en: 'twenty', es: 'veinte' },
    { en: 'thirty', es: 'treinta' },
    { en: 'forty', es: 'cuarenta' },
    { en: 'fifty', es: 'cincuenta' },
    { en: 'hundred', es: 'cien', ej: 'one hundred' },
    { en: 'number', es: 'número', ej: 'My number is 55 20 31.' },
    { en: 'age', es: 'edad' },
    { en: 'year', es: 'año', ej: 'I am twenty years old.' },
    { en: 'How old are you?', es: '¿cuántos años tienes?', ej: 'How old are you? I am 25.' },
    { en: 'years old', es: 'años (de edad)', ej: 'She is ten years old.' },
    { en: 'phone number', es: 'número de teléfono', ej: 'What is your phone number?' }
  ],

  gramatica: [
    {
      titulo: 'Del 13 al 99: dos familias que suenan parecido',
      html: `<p>Los <b>-teen</b> (13 a 19) y los <b>-ty</b> (20, 30, 40...) se confunden muchísimo al oído. La diferencia está en el acento:</p>
        <table>
          <tr><th>-teen (acento al final)</th><th>-ty (acento al principio)</th></tr>
          <tr><td><span class="ej">thirteen</span> (13)</td><td><span class="ej">thirty</span> (30)</td></tr>
          <tr><td><span class="ej">fourteen</span> (14)</td><td><span class="ej">forty</span> (40)</td></tr>
          <tr><td><span class="ej">fifteen</span> (15)</td><td><span class="ej">fifty</span> (50)</td></tr>
          <tr><td><span class="ej">sixteen</span> (16)</td><td><span class="ej">sixty</span> (60)</td></tr>
          <tr><td><span class="ej">seventeen</span> (17)</td><td><span class="ej">seventy</span> (70)</td></tr>
          <tr><td><span class="ej">eighteen</span> (18)</td><td><span class="ej">eighty</span> (80)</td></tr>
          <tr><td><span class="ej">nineteen</span> (19)</td><td><span class="ej">ninety</span> (90)</td></tr>
        </table>
        <p>Los compuestos van con guion: <span class="ej">twenty-one</span> (21), <span class="ej">thirty-five</span> (35), <span class="ej">ninety-nine</span> (99). Y 100 es <span class="ej">one hundred</span>.</p>
        <div class="nota">Ojo a las tres irregulares: 13 es <b>thirteen</b> (no "threeteen"), 15 es <b>fifteen</b> (no "fiveteen") y 40 es <b>forty</b> (pierde la u de four).</div>`
    },
    {
      titulo: 'La edad: en inglés la edad se ES, no se TIENE',
      html: `<p>En español tienes años; en inglés <b>eres</b> años. Nunca se usa "have" para la edad:</p>
        <table>
          <tr><td><span class="ej">How old are you?</span></td><td class="ejta">¿Cuántos años tienes?</td></tr>
          <tr><td><span class="ej">I am 25 years old.</span></td><td class="ejta">Tengo 25 años.</td></tr>
          <tr><td><span class="ej">I am 25.</span></td><td class="ejta">Tengo 25. (el "years old" se puede callar)</td></tr>
        </table>
        <div class="nota">Decir "I have 25 years" es EL error clásico del hispanohablante. Si te sale, no pasa nada: te van a entender, pero suena mal. La forma correcta es <b>I am 25</b>.</div>
        <p>Los teléfonos se dicen número por número: 55 20 31 = <span class="ej">five five, two zero, three one</span>. El 0 también puede decirse "oh", como la letra.</p>`
    }
  ],

  dialogo: {
    titulo: 'La edad y el teléfono',
    lineas: [
      { q: 'A', en: 'How old are you, Tom?', es: '¿Cuántos años tienes, Tom?' },
      { q: 'B', en: 'I am twenty-two years old. And you?', es: 'Tengo veintidós años. ¿Y tú?' },
      { q: 'A', en: 'I am nineteen.', es: 'Tengo diecinueve.' },
      { q: 'B', en: 'Nineteen? Nice!', es: '¿Diecinueve? ¡Qué bien!' },
      { q: 'A', en: 'What is your phone number?', es: '¿Cuál es tu número de teléfono?' },
      { q: 'B', en: 'It is five five five, three zero, seven one.', es: 'Es cinco cinco cinco, tres cero, siete uno.' },
      { q: 'A', en: 'Five five five, three zero, seven one. Thanks!', es: 'Cinco cinco cinco, tres cero, siete uno. ¡Gracias!' },
      { q: 'B', en: "You're welcome. See you later!", es: 'De nada. ¡Nos vemos!' }
    ],
    preguntas: [
      { tipo: 'opcion', q: '¿Cuántos años tiene Tom?', opciones: ['12', '22', '19'], r: 1, di: 'I am twenty-two years old' },
      { tipo: 'opcion', q: '¿Cuántos años tiene ella?', opciones: ['90', '9', '19'], r: 2, di: 'I am nineteen' },
      { tipo: 'opcion', q: '¿En qué termina el teléfono de Tom?', opciones: ['...seven one', '...one seven', '...three zero'], r: 0, di: 'seven one' }
    ]
  },

  ejercicios: [
    { tipo: 'parejas', pares: [['three', '3'], ['five', '5'], ['eight', '8'], ['eleven', '11'], ['twelve', '12']] },
    { tipo: 'parejas', pares: [['thirteen', '13'], ['thirty', '30'], ['fifteen', '15'], ['fifty', '50'], ['forty', '40']] },
    { tipo: 'opcion', q: '¿Cómo se escribe 15?', opciones: ['fiveteen', 'fifteen', 'fifty'], r: 1, di: 'fifteen', vocabIdx: 14 },
    { tipo: 'opcion', q: '¿Cómo se escribe 40?', opciones: ['fourty', 'fourteen', 'forty'], r: 2, di: 'forty', vocabIdx: 17 },
    { tipo: 'opcion', q: '¿Cuánto es twenty-seven?', opciones: ['72', '27', '17'], r: 1, di: 'twenty-seven' },
    { tipo: 'escucha', en: 'thirteen' },
    { tipo: 'escucha', en: 'thirty' },
    { tipo: 'escucha', en: 'My phone number is five five, two zero.' },
    { tipo: 'traduce', es: '7 (en letras)', en: ['seven'], vocabIdx: 7 },
    { tipo: 'traduce', es: '20 (en letras)', en: ['twenty'], vocabIdx: 15 },
    { tipo: 'traduce', es: '100 (en letras)', en: ['one hundred', 'a hundred', 'hundred'], vocabIdx: 19 },
    { tipo: 'huecos', antes: 'How', despues: 'are you?', opciones: ['old', 'age', 'years'], r: 0 },
    { tipo: 'huecos', antes: 'I', despues: 'twenty years old.', opciones: ['have', 'am', 'is'], r: 1 },
    { tipo: 'ordena', es: '¿Cuántos años tienes?', en: 'How old are you?', extra: ['have'] },
    { tipo: 'ordena', es: 'Tengo treinta años.', en: 'I am thirty years old.', extra: ['have'] },
    { tipo: 'habla', en: 'I am twenty-five years old.', es: 'Tengo veinticinco años.' },
    { tipo: 'habla', en: 'What is your phone number?', es: '¿Cuál es tu número de teléfono?' }
  ],

  examen: [
    { tipo: 'opcion', q: '¿Cómo se escribe 13?', opciones: ['thirty', 'thirteen', 'threeteen'], r: 1, di: 'thirteen' },
    { tipo: 'opcion', q: '¿Cuánto es fifty?', opciones: ['15', '50', '5'], r: 1, di: 'fifty' },
    { tipo: 'opcion', q: '¿Cómo se dice 66?', opciones: ['sixteen-six', 'sixty-six', 'six-sixty'], r: 1, di: 'sixty-six' },
    { tipo: 'traduce', es: '9 (en letras)', en: ['nine'] },
    { tipo: 'traduce', es: '12 (en letras)', en: ['twelve'] },
    { tipo: 'traduce', es: '80 (en letras)', en: ['eighty'] },
    { tipo: 'escucha', en: 'fourteen' },
    { tipo: 'escucha', en: 'I am nineteen years old.' },
    { tipo: 'huecos', antes: 'She is ten', despues: 'old.', opciones: ['years', 'year', 'age'], r: 0 },
    { tipo: 'huecos', antes: 'I', despues: '25.', opciones: ['have', 'am', 'has'], r: 1 },
    { tipo: 'ordena', es: '¿Cuántos años tiene ella? (usa "she")', en: 'How old is she?' },
    { tipo: 'ordena', es: 'Mi número es cinco cero dos.', en: 'My number is five zero two.' }
  ],

  ensayo: {
    resumen: 'Tu edad y tus números',
    consigna: 'Escribe cuatro frases: tu nombre, tu edad (I am...), tu número favorito (My favorite number is...) y tu número de teléfono inventado, en letras.',
    min: 20
  }
});
