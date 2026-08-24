/* Unidad 6 — Presente simple I: rutinas con I, you, we, they */
CURSO.push({
  id: 'u06',
  nivel: 'A1',
  titulo: 'Mi rutina',
  descripcion: 'Contar qué haces todos los días: los verbos de siempre con I, you, we y they.',

  vocab: [
    { en: 'work', es: 'trabajar', ej: 'I work at home.' },
    { en: 'live', es: 'vivir', ej: 'I live in Lima.' },
    { en: 'eat', es: 'comer', ej: 'We eat at eight.' },
    { en: 'drink', es: 'beber, tomar', ej: 'I drink coffee.' },
    { en: 'go', es: 'ir', ej: 'They go to school.' },
    { en: 'get up', es: 'levantarse', ej: 'I get up at seven.' },
    { en: 'sleep', es: 'dormir' },
    { en: 'study', es: 'estudiar', ej: 'I study English.' },
    { en: 'play', es: 'jugar, tocar (música)', ej: 'We play video games.' },
    { en: 'watch', es: 'ver, mirar', ej: 'I watch series at night.' },
    { en: 'read', es: 'leer' },
    { en: 'listen to', es: 'escuchar', ej: 'I listen to music.' },
    { en: 'speak', es: 'hablar' },
    { en: 'cook', es: 'cocinar' },
    { en: 'clean', es: 'limpiar' },
    { en: 'buy', es: 'comprar' },
    { en: 'walk', es: 'caminar' },
    { en: 'run', es: 'correr' },
    { en: 'home', es: 'casa (la propia)', ej: 'I work at home.' },
    { en: 'school', es: 'escuela, colegio' },
    { en: 'music', es: 'música' },
    { en: 'every day', es: 'todos los días', ej: 'I study every day.' },
    { en: 'in the morning', es: 'en la mañana', ej: 'I run in the morning.' },
    { en: 'at night', es: 'en la noche' },
    { en: 'breakfast', es: 'desayuno', ej: 'I eat breakfast at seven.' },
    { en: 'dinner', es: 'cena' }
  ],

  gramatica: [
    {
      titulo: 'El presente simple: la forma más fácil del inglés',
      html: `<p>Para hablar de rutinas y cosas que pasan siempre, con <b>I, you, we, they</b> el verbo va tal cual, sin cambiarle nada:</p>
        <table>
          <tr><td><span class="ej">I work every day.</span></td><td class="ejta">Trabajo todos los días.</td></tr>
          <tr><td><span class="ej">You speak Spanish.</span></td><td class="ejta">Hablas español.</td></tr>
          <tr><td><span class="ej">We live in Lima.</span></td><td class="ejta">Vivimos en Lima.</td></tr>
          <tr><td><span class="ej">They play video games at night.</span></td><td class="ejta">Ellos juegan videojuegos en la noche.</td></tr>
        </table>
        <div class="nota">En español el verbo cambia con cada persona (trabajo, trabajas, trabajamos...). En inglés no: work, work, work. La única persona especial es he/she/it, y esa es la próxima unidad.</div>`
    },
    {
      titulo: 'in, at, to: las chiquitas que acompañan la rutina',
      html: `<p>Algunas combinaciones se aprenden en bloque, como si fueran una sola palabra:</p>
        <table>
          <tr><td><span class="ej">I live in Lima.</span></td><td class="ejta">in + ciudad o país</td></tr>
          <tr><td><span class="ej">I get up at seven.</span></td><td class="ejta">at + hora</td></tr>
          <tr><td><span class="ej">I work at home.</span></td><td class="ejta">at home = en casa (sin "the")</td></tr>
          <tr><td><span class="ej">They go to school.</span></td><td class="ejta">go TO + lugar</td></tr>
          <tr><td><span class="ej">I listen to music.</span></td><td class="ejta">listen siempre lleva to</td></tr>
          <tr><td><span class="ej">in the morning / at night</span></td><td class="ejta">en la mañana / en la noche (así, sin lógica: se memorizan)</td></tr>
        </table>
        <p>El orden normal de la frase: quién + verbo + qué + dónde + cuándo. <span class="ej">I drink coffee at home in the morning.</span></p>`
    }
  ],

  dialogo: {
    titulo: 'Un día normal',
    lineas: [
      { q: 'A', en: 'I get up at six every day.', es: 'Me levanto a las seis todos los días.' },
      { q: 'B', en: 'At six? Why?', es: '¿A las seis? ¿Por qué?' },
      { q: 'A', en: 'I run in the morning. Then I eat breakfast.', es: 'Corro en la mañana. Después desayuno.' },
      { q: 'B', en: 'I get up at nine. I work at home.', es: 'Yo me levanto a las nueve. Trabajo en casa.' },
      { q: 'A', en: 'Nice! And at night?', es: '¡Qué bien! ¿Y en la noche?' },
      { q: 'B', en: 'I cook dinner and I watch series.', es: 'Cocino la cena y veo series.' },
      { q: 'A', en: 'We watch series every night too.', es: 'Nosotros también vemos series todas las noches.' },
      { q: 'B', en: 'And I study English every day!', es: '¡Y estudio inglés todos los días!' }
    ],
    preguntas: [
      { tipo: 'opcion', q: '¿A qué hora se levanta A?', opciones: ['A las seis', 'A las nueve', 'A las siete'], r: 0, di: 'I get up at six' },
      { tipo: 'opcion', q: '¿Qué hace A en la mañana?', opciones: ['Trabaja', 'Corre', 'Cocina'], r: 1, di: 'I run in the morning' },
      { tipo: 'opcion', q: '¿Dónde trabaja B?', opciones: ['En una escuela', 'En casa', 'No trabaja'], r: 1, di: 'I work at home' }
    ]
  },

  ejercicios: [
    { tipo: 'parejas', pares: [['eat', 'comer'], ['sleep', 'dormir'], ['buy', 'comprar'], ['clean', 'limpiar'], ['run', 'correr']] },
    { tipo: 'parejas', pares: [['get up', 'levantarse'], ['watch', 'ver, mirar'], ['cook', 'cocinar'], ['walk', 'caminar'], ['read', 'leer']] },
    { tipo: 'huecos', antes: 'I', despues: 'in Lima.', opciones: ['live', 'lives', 'am live'], r: 0 },
    { tipo: 'huecos', antes: 'We', despues: 'coffee in the morning.', opciones: ['drink', 'drinks', 'are drink'], r: 0 },
    { tipo: 'huecos', antes: 'They go', despues: 'school every day.', opciones: ['to', 'at', 'in'], r: 0 },
    { tipo: 'huecos', antes: 'I get up', despues: 'seven.', opciones: ['in', 'at', 'to'], r: 1 },
    { tipo: 'huecos', antes: 'I listen', despues: 'music at night.', opciones: ['to', 'at', 'the'], r: 0 },
    { tipo: 'traduce', es: 'trabajar', en: ['work'], vocabIdx: 0 },
    { tipo: 'traduce', es: 'estudiar', en: ['study'], vocabIdx: 7 },
    { tipo: 'traduce', es: 'Vivo en Lima.', en: ['i live in lima'], vocabIdx: 1 },
    { tipo: 'traduce', es: 'Estudiamos inglés todos los días.', en: ['we study english every day'], vocabIdx: 21 },
    { tipo: 'escucha', en: 'I drink coffee every morning.' },
    { tipo: 'escucha', en: 'They play video games at night.' },
    { tipo: 'ordena', es: 'Me levanto a las siete.', en: 'I get up at seven.', extra: ['in'] },
    { tipo: 'ordena', es: 'Vemos series en la noche.', en: 'We watch series at night.', extra: ['watches'] },
    { tipo: 'habla', en: 'I study English every day.', es: 'Estudio inglés todos los días.' },
    { tipo: 'habla', en: 'I get up at seven in the morning.', es: 'Me levanto a las siete de la mañana.' }
  ],

  examen: [
    { tipo: 'huecos', antes: 'You', despues: 'English very well.', opciones: ['speak', 'speaks', 'are speak'], r: 0 },
    { tipo: 'huecos', antes: 'We eat dinner', despues: 'night.', opciones: ['in', 'at', 'to'], r: 1 },
    { tipo: 'huecos', antes: 'I run', despues: 'the morning.', opciones: ['at', 'to', 'in'], r: 2 },
    { tipo: 'huecos', antes: 'They', despues: 'to music every day.', opciones: ['listen', 'listens', 'hear'], r: 0 },
    { tipo: 'opcion', q: '"I work at home" significa:', opciones: ['Trabajo en casa', 'Voy al trabajo', 'Trabajo de noche'], r: 0, di: 'I work at home' },
    { tipo: 'opcion', q: 'El orden correcto es:', opciones: ['I at seven get up', 'I get up at seven', 'Get up I at seven'], r: 1, di: 'I get up at seven' },
    { tipo: 'traduce', es: 'leer', en: ['read'] },
    { tipo: 'traduce', es: 'desayuno', en: ['breakfast'] },
    { tipo: 'traduce', es: 'Como en casa.', en: ['i eat at home'] },
    { tipo: 'escucha', en: 'We live in a big city.' },
    { tipo: 'ordena', es: 'Ellos caminan a la escuela.', en: 'They walk to school.' },
    { tipo: 'ordena', es: 'Tomo café en la mañana.', en: 'I drink coffee in the morning.' }
  ],

  ensayo: {
    resumen: 'Tu día, de la mañana a la noche',
    consigna: 'Cuenta tu rutina en seis frases o más: a qué hora te levantas, qué comes, qué haces en el día y en la noche. Solo con I y we.',
    min: 40
  }
});
