/* Unidad 4 — La familia y los posesivos */
CURSO.push({
  id: 'u04',
  nivel: 'A1',
  titulo: 'La familia',
  descripcion: 'Presentar a tu familia con los posesivos: my, your, his, her... y el apóstrofo de "Ana\'s".',

  vocab: [
    { en: 'family', es: 'familia', ej: 'My family is big.' },
    { en: 'mother', es: 'madre', ej: 'My mother is a teacher.' },
    { en: 'mom', es: 'mamá' },
    { en: 'father', es: 'padre' },
    { en: 'dad', es: 'papá' },
    { en: 'parents', es: 'padres (mamá y papá)', ej: 'My parents are from Lima.' },
    { en: 'brother', es: 'hermano', ej: 'I have one brother.' },
    { en: 'sister', es: 'hermana' },
    { en: 'son', es: 'hijo' },
    { en: 'daughter', es: 'hija' },
    { en: 'children', es: 'hijos, niños', ej: 'They have three children.' },
    { en: 'grandmother', es: 'abuela' },
    { en: 'grandfather', es: 'abuelo' },
    { en: 'uncle', es: 'tío' },
    { en: 'aunt', es: 'tía' },
    { en: 'cousin', es: 'primo, prima' },
    { en: 'husband', es: 'esposo' },
    { en: 'wife', es: 'esposa' },
    { en: 'dog', es: 'perro', ej: 'Rex is my dog.' },
    { en: 'cat', es: 'gato' },
    { en: 'I have...', es: 'tengo...', ej: 'I have two sisters.' },
    { en: 'this is...', es: 'este es..., esta es...', ej: 'This is my brother Tom.' },
    { en: 'Who is...?', es: '¿quién es...?', ej: 'Who is that woman?' },
    { en: 'old', es: 'viejo, mayor', ej: 'My grandfather is old.' },
    { en: 'young', es: 'joven' }
  ],

  gramatica: [
    {
      titulo: 'Los posesivos: my, your, his, her...',
      html: `<p>En español el posesivo concuerda con la cosa ("su casa"); en inglés depende del DUEÑO. Por eso his y her existen:</p>
        <table>
          <tr><th>Dueño</th><th>Posesivo</th><th>Ejemplo</th></tr>
          <tr><td>I</td><td>my</td><td><span class="ej">my mother</span> — mi madre</td></tr>
          <tr><td>you</td><td>your</td><td><span class="ej">your dog</span> — tu perro</td></tr>
          <tr><td>he</td><td>his</td><td><span class="ej">his sister</span> — la hermana DE ÉL</td></tr>
          <tr><td>she</td><td>her</td><td><span class="ej">her sister</span> — la hermana DE ELLA</td></tr>
          <tr><td>it</td><td>its</td><td><span class="ej">its name</span> — su nombre (de una cosa o animal)</td></tr>
          <tr><td>we</td><td>our</td><td><span class="ej">our house</span> — nuestra casa</td></tr>
          <tr><td>they</td><td>their</td><td><span class="ej">their children</span> — los hijos de ellos</td></tr>
        </table>
        <div class="nota">El error típico: "su hermano" puede ser <b>his brother</b> o <b>her brother</b>. Pregúntate siempre de quién es: ¿de él o de ella?</div>`
    },
    {
      titulo: "El apóstrofo: Ana's brother",
      html: `<p>Para decir "el hermano de Ana", el inglés lo da vuelta y usa apóstrofo + s. Primero el dueño, después la cosa:</p>
        <table>
          <tr><td><span class="ej">Ana's brother</span></td><td class="ejta">el hermano de Ana</td></tr>
          <tr><td><span class="ej">my father's car</span></td><td class="ejta">el auto de mi padre</td></tr>
          <tr><td><span class="ej">Tom's dog is old.</span></td><td class="ejta">El perro de Tom es viejo.</td></tr>
        </table>
        <p>Y para preguntar quién es alguien:</p>
        <table>
          <tr><td><span class="ej">Who is she?</span></td><td class="ejta">¿Quién es ella?</td></tr>
          <tr><td><span class="ej">She is my aunt.</span></td><td class="ejta">Es mi tía.</td></tr>
          <tr><td><span class="ej">This is my cousin Leo.</span></td><td class="ejta">Este es mi primo Leo. (así se presenta a alguien)</td></tr>
        </table>
        <div class="nota"><b>children</b> es el plural de child (niño), sin s: "three childrens" no existe. Y <b>parents</b> son los padres (mamá y papá); "mis papás" = my parents.</div>`
    }
  ],

  dialogo: {
    titulo: 'Una foto de familia',
    lineas: [
      { q: 'A', en: 'Look, this is a photo of my family.', es: 'Mira, esta es una foto de mi familia.' },
      { q: 'B', en: 'Nice! Who is this man?', es: '¡Qué bien! ¿Quién es este hombre?' },
      { q: 'A', en: 'He is my father. His name is Carlos.', es: 'Es mi padre. Se llama Carlos.' },
      { q: 'B', en: 'And who is she?', es: '¿Y ella quién es?' },
      { q: 'A', en: 'She is my sister. Her name is Lucia.', es: 'Es mi hermana. Se llama Lucía.' },
      { q: 'B', en: 'Is she young?', es: '¿Es joven?' },
      { q: 'A', en: 'Yes, she is twelve years old.', es: 'Sí, tiene doce años.' },
      { q: 'B', en: 'And the dog? Is it your dog?', es: '¿Y el perro? ¿Es tu perro?' },
      { q: 'A', en: "No, it is my sister's dog. Its name is Rex.", es: 'No, es el perro de mi hermana. Se llama Rex.' }
    ],
    preguntas: [
      { tipo: 'opcion', q: '¿Cómo se llama el padre?', opciones: ['Rex', 'Carlos', 'Leo'], r: 1, di: 'His name is Carlos' },
      { tipo: 'opcion', q: '¿Cuántos años tiene Lucía?', opciones: ['2', '20', '12'], r: 2, di: 'She is twelve years old' },
      { tipo: 'opcion', q: '¿De quién es el perro?', opciones: ['De A', 'De la hermana', 'Del padre'], r: 1, di: "It is my sister's dog" }
    ]
  },

  ejercicios: [
    { tipo: 'parejas', pares: [['mother', 'madre'], ['brother', 'hermano'], ['daughter', 'hija'], ['aunt', 'tía'], ['grandfather', 'abuelo']] },
    { tipo: 'huecos', antes: 'Tom y su hermana: This is Tom and this is', despues: 'sister.', opciones: ['his', 'her', 'their'], r: 0 },
    { tipo: 'huecos', antes: 'Ana y su perro: Rex is', despues: 'dog.', opciones: ['his', 'her', 'my'], r: 1 },
    { tipo: 'huecos', antes: 'Nosotros: This is', despues: 'house.', opciones: ['our', 'their', 'your'], r: 0 },
    { tipo: 'huecos', antes: 'Ellos: I like', despues: 'children.', opciones: ['his', 'our', 'their'], r: 2 },
    { tipo: 'opcion', q: '"El auto de mi padre" en inglés:', opciones: ["my father's car", 'the car of my father', "my father car's"], r: 0, di: "my father's car" },
    { tipo: 'opcion', q: 'El plural de child es:', opciones: ['childs', 'children', 'childrens'], r: 1, di: 'children', vocabIdx: 10 },
    { tipo: 'traduce', es: 'padres (mamá y papá)', en: ['parents'], vocabIdx: 5 },
    { tipo: 'traduce', es: 'esposa', en: ['wife'], vocabIdx: 17 },
    { tipo: 'traduce', es: 'Tengo dos hermanas.', en: ['i have two sisters'], vocabIdx: 20 },
    { tipo: 'traduce', es: 'Esta es mi madre.', en: ['this is my mother', 'this is my mom'], vocabIdx: 21 },
    { tipo: 'escucha', en: 'Who is that woman?' },
    { tipo: 'escucha', en: "This is my sister's dog." },
    { tipo: 'ordena', es: '¿Quién es él?', en: 'Who is he?', extra: ['who\'s'] },
    { tipo: 'ordena', es: 'El nombre de mi abuela es Rosa.', en: "My grandmother's name is Rosa." },
    { tipo: 'habla', en: 'This is my family.', es: 'Esta es mi familia.' },
    { tipo: 'habla', en: 'Her name is Lucia.', es: 'Ella se llama Lucía.' }
  ],

  examen: [
    { tipo: 'huecos', antes: 'Ella y su hermano: This is Ana and', despues: 'brother.', opciones: ['his', 'her', 'its'], r: 1 },
    { tipo: 'huecos', antes: 'Él y su madre: Tom loves', despues: 'mother.', opciones: ['his', 'her', 'their'], r: 0 },
    { tipo: 'huecos', antes: 'El perro y su nombre:', despues: 'name is Rex.', opciones: ['His', 'Its', 'Their'], r: 1 },
    { tipo: 'opcion', q: '"La hija de Tom" en inglés:', opciones: ["Tom's daughter", 'the daughter of Tom', "Tom daughter's"], r: 0, di: "Tom's daughter" },
    { tipo: 'opcion', q: '¿Cuál es la pareja correcta?', opciones: ['son / hija', 'daughter / hija', 'aunt / abuela'], r: 1 },
    { tipo: 'opcion', q: '"They have three children" significa:', opciones: ['Tienen tres hijos', 'Son tres hermanos', 'Tienen tres primos'], r: 0, di: 'They have three children' },
    { tipo: 'traduce', es: 'tío', en: ['uncle'] },
    { tipo: 'traduce', es: 'abuela', en: ['grandmother', 'grandma'] },
    { tipo: 'traduce', es: 'Mi familia es grande.', en: ['my family is big'] },
    { tipo: 'escucha', en: 'My parents are from Lima.' },
    { tipo: 'ordena', es: 'Este es mi primo Leo.', en: 'This is my cousin Leo.' },
    { tipo: 'ordena', es: 'El gato de Ana es joven.', en: "Ana's cat is young." }
  ],

  ensayo: {
    resumen: 'Presenta a tu familia',
    consigna: 'Presenta a tres personas de tu familia (o inventada): quiénes son, cómo se llaman (his/her name is...) y algo de cada una (edad, de dónde son).',
    min: 30
  }
});
