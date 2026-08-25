# -*- coding: utf-8 -*-
# El validador y el extractor aprenden el formato PPP:
#  - escena: sus lineas se validan (todo lo que suena debe estar enseñado en
#    esa leccion o antes) y se pregraban con la voz de su hablante
#  - entiende / practica / produce: se validan y extraen igual que ejercicios
#  - uso / por: son español, ni se validan ni se graban
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

parchea('herramientas/valida-ensenanza.js', [
("""  for (const l of u.lecciones) {
    (l.nuevas || []).forEach((i) => { ensena(u.vocab[i].en); if (u.vocab[i].ej) ensena(u.vocab[i].ej); });
    (l.regalos || []).forEach((w) => bolsa.add(w));
    if (l.dialogo) {
      l.dialogo.lineas.forEach((x) => revisa({ tipo: 'escucha', en: x.en }, l.id + ' diálogo'));
      l.dialogo.preguntas.forEach((ej, i) => revisa(ej, l.id + ' pregunta#' + i));
    }
    (l.ejercicios || []).forEach((ej, i) => revisa(ej, l.id + ' ej#' + i));
  }""",
 """  for (const l of u.lecciones) {
    // lo que la leccion presenta cuenta como enseñado ANTES de revisar su
    // escena: la escena es justamente donde se presenta
    (l.nuevas || []).forEach((i) => { ensena(u.vocab[i].en); if (u.vocab[i].ej) ensena(u.vocab[i].ej); });
    (l.regalos || []).forEach((w) => bolsa.add(w));
    if (l.escena) {
      l.escena.lineas.filter((x) => !x.t).forEach((x) => revisa({ tipo: 'escucha', en: x.en }, l.id + ' escena'));
    }
    if (l.dialogo) {
      l.dialogo.lineas.forEach((x) => revisa({ tipo: 'escucha', en: x.en }, l.id + ' diálogo'));
      l.dialogo.preguntas.forEach((ej, i) => revisa(ej, l.id + ' pregunta#' + i));
    }
    (l.ejercicios || []).forEach((ej, i) => revisa(ej, l.id + ' ej#' + i));
    (l.entiende || []).forEach((ej, i) => revisa(ej, l.id + ' entiende#' + i));
    (l.practica || []).forEach((ej, i) => revisa(ej, l.id + ' practica#' + i));
    (l.produce || []).forEach((ej, i) => revisa(ej, l.id + ' produce#' + i));
  }""" ),
])

parchea('herramientas/extrae-frases.js', [
("""    for (const l of u.lecciones) {
      deHTML(l.html);
      if (l.dialogo) deDialogo(l.dialogo);
      (l.ejercicios || []).forEach(deEjercicio);
    }""",
 """    for (const l of u.lecciones) {
      deHTML(l.html);
      if (l.escena) l.escena.lineas.filter((x) => !x.t).forEach((x) => mete(x.en, x.q === 'B' ? 'b' : 'a'));
      if (l.dialogo) deDialogo(l.dialogo);
      (l.ejercicios || []).forEach(deEjercicio);
      (l.entiende || []).forEach(deEjercicio);
      (l.practica || []).forEach(deEjercicio);
      (l.produce || []).forEach(deEjercicio);
    }""" ),
])
