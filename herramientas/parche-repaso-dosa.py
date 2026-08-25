# -*- coding: utf-8 -*-
# Repaso de Dosa del 2026-08-25. Cinco arreglos de motor:
#
# 1. MAYUSCULAS: mayus() ponia en mayuscula el PRIMER CARACTER. En "¿como
#    estas?" ese caracter es el "¿", asi que la letra se quedaba minuscula.
#    Ahora se busca la primera LETRA, saltando ¿ ¡ " ( etc.
#
# 2. ENTER SE COMIA EL VEREDICTO: el Enter del campo de texto llamaba a
#    comprobar(), que creaba el veredicto y le enganchaba un listener de
#    keydown en document... y ESE MISMO evento seguia burbujeando hasta
#    document, asi que el veredicto se cerraba solo. Se ignora el evento que
#    ya estaba en vuelo comparando timeStamp.
#
# 3. LAS PAREJAS NO SONABAN: se mandaba a la voz el textContent del boton, que
#    esta capitalizado al pintar ("Hello"), y el manifiesto de audio guarda la
#    clave tal cual ("hello"). No habia clip y se caia al sintetizador, que
#    aqui no habla ingles. Se guarda el texto crudo en data-en, y ademas voz.js
#    aprende a buscar sin distinguir mayusculas.
#
# 4. COMPROBAR DE "ORDENA": era un .btn pelado, identico a las piezas de
#    palabras. Pasa al pie, ancho y con acento, como en los demas ejercicios.
#
# 5. LA BARRA DEL MEDIO DEL MENU se veia mas fina: 2,5px de alto con 2,5px de
#    margen dejaba las tres barras en posiciones fraccionarias y el navegador
#    redondeaba cada una distinto. Todo a enteros.
import io
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

def parchea(nombre, cambios):
    p = RAIZ / nombre
    s = io.open(p, encoding='utf-8').read()
    for viejo, nuevo in cambios:
        assert viejo in s, 'NO ENCONTRADO en ' + nombre + ': ' + viejo[:80]
        s = s.replace(viejo, nuevo)
    io.open(p, 'w', encoding='utf-8').write(s)
    print(nombre + ': parcheado')

parchea('docs/app.js', [

# 1. mayusculas saltando la puntuacion de apertura
("""function mayus(t) {
  const s = String(t);
  return s.charAt(0).toUpperCase() + s.slice(1);
}""",
 """function mayus(t) {
  const s = String(t);
  // La mayuscula va en la primera LETRA, no en el primer caracter: en
  // "¿como estas?" el primer caracter es el "¿" y la letra se quedaba abajo.
  const i = s.search(/\\p{L}/u);
  if (i < 0) return s;
  return s.slice(0, i) + s.charAt(i).toUpperCase() + s.slice(i + 1);
}""" ),

# 2. el Enter que abre el veredicto no puede cerrarlo
("""    const cierra = () => {
      capa.remove();
      document.body.classList.remove('con-veredicto');
      document.removeEventListener('keydown', porTecla);
      continuar();
    };
    const porTecla = (e) => { if (e.key === 'Enter') cierra(); };""",
 """    // El Enter que disparo el veredicto SIGUE burbujeando hasta document, y
    // este listener nace en mitad de ese viaje: sin la guarda, ese mismo Enter
    // cerraba el veredicto antes de que se llegara a leer.
    const nacido = performance.now();
    const cierra = () => {
      capa.remove();
      document.body.classList.remove('con-veredicto');
      document.removeEventListener('keydown', porTecla);
      continuar();
    };
    const porTecla = (e) => { if (e.key === 'Enter' && e.timeStamp > nacido) cierra(); };""" ),

# 3. las parejas dicen el texto CRUDO, no el capitalizado de la pantalla
("""        <div class="parejas">${mezcla.map((c) => `<button class="pareja" data-par="${c.par}" data-lado="${c.lado}">${esc(mayus(c.t))}</button>`).join('')}</div>`;""",
 """        <div class="parejas">${mezcla.map((c) => `<button class="pareja" data-par="${c.par}" data-lado="${c.lado}" data-en="${esc(c.t)}">${esc(mayus(c.t))}</button>`).join('')}</div>`;""" ),
("""          const en = elegida.dataset.lado === 'a' ? elegida.textContent : b.textContent;
          Voz.di(en, { lento: false });""",
 """          // data-en: el texto tal cual esta en el curso. El de pantalla va
          // capitalizado y no casa con la clave del manifiesto de audio.
          const lado = elegida.dataset.lado === 'a' ? elegida : b;
          Voz.di(lado.dataset.en, { lento: false });""" ),

# 4. comprobar de "ordena": al pie, ancho y con acento
("""        <div class="acciones"><button class="btn" id="comprobar" disabled>Comprobar</button></div>`;""",
 """        <div class="pie-accion"><button class="btn ancho acento" id="comprobar" disabled>Comprobar</button></div>`;""" ),
])

# 5. voz.js: red de seguridad para las claves con mayusculas
parchea('docs/voz.js', [
("""    const clave = (opciones.voz === 'b' ? 'b|' : 'a|') + texto;
    const archivo = !opciones.dinamico && (typeof AUDIO_MAPA !== 'undefined') && (AUDIO_MAPA[clave] || AUDIO_MAPA['a|' + texto]);""",
 """    const clave = (opciones.voz === 'b' ? 'b|' : 'a|') + texto;
    const archivo = !opciones.dinamico && (typeof AUDIO_MAPA !== 'undefined')
      && (AUDIO_MAPA[clave] || AUDIO_MAPA['a|' + texto] || porMinusculas(clave) || porMinusculas('a|' + texto));""" ),
("""  // ---- 2. voz de la nube (se engancha desde app.js cuando hay pase) ----""",
 """  // Red de seguridad: el manifiesto guarda el texto tal cual esta en el curso
  // ("hello"), pero la pantalla lo capitaliza. Si alguna vista manda el texto
  // ya capitalizado, se busca igual en vez de quedarse muda.
  let mapaMinus = null;
  function porMinusculas(clave) {
    if (typeof AUDIO_MAPA === 'undefined') return null;
    if (!mapaMinus) {
      mapaMinus = {};
      for (const k in AUDIO_MAPA) mapaMinus[k.toLowerCase()] = AUDIO_MAPA[k];
    }
    return mapaMinus[clave.toLowerCase()] || null;
  }

  // ---- 2. voz de la nube (se engancha desde app.js cuando hay pase) ----""" ),
])

# 6. estilo.css: la barra del menu a enteros
parchea('docs/estilo.css', [
(""".btn-menu i {
  display: block; width: 17px; height: 2.5px; border-radius: 3px; margin: 2.5px 0;""",
 """/* Todo en enteros: con 2,5px de alto y 2,5px de margen las tres barras caian
   en posiciones fraccionarias y el navegador redondeaba cada una distinto —
   la del medio se veia mas fina. */
.btn-menu i {
  display: block; width: 18px; height: 2px; border-radius: 2px; margin: 2px 0;""" ),
(""".btn-menu.abierto i { margin: -1.25px; }""",
 """.btn-menu.abierto i { margin: -1px; }""" ),
])
