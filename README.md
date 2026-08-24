# INGLES

Curso personal de inglés desde cero (A0 → A1), como web interactiva. Sin
frameworks y sin dependencias: HTML, CSS y JS planos servidos por GitHub Pages,
más un worker de Cloudflare para el progreso y la IA.

## Qué hace

- **12 unidades** con vocabulario (314 palabras con audio), gramática explicada
  en español neutro, y un diálogo con dos voces por unidad.
- **7 tipos de ejercicio**: opción múltiple, completar huecos, traducir, dictado
  (escucha y escribe), ordenar palabras, parejas y **pronunciación por
  micrófono** (reconocimiento de voz del navegador, puntuado palabra a palabra).
- **Examen por unidad**: 10 preguntas del banco; con 70% se abre la siguiente.
- **Repaso espaciado**: cada palabra fallada vuelve a aparecer al día siguiente,
  a los 3, 7, 14 y 30 días (cajas tipo Leitner).
- **Ensayos corregidos por IA** (Groq vía el worker): puntaje, correcciones
  explicadas y versión mejorada.
- **Modo conversación**: un tutor de IA que habla al nivel de la unidad más
  alta desbloqueada y corrige un error por turno.
- **XP y racha diaria**, con progreso sincronizado entre dispositivos.

El audio sale de `speechSynthesis` (voces de Google en Chrome) y el
reconocimiento de `webkitSpeechRecognition`: no hay ningún servicio de pago.

## Estructura

- `docs/` — la página (GitHub Pages sirve esta carpeta).
  - `app.js` — el motor: vistas, corredor de ejercicios, SRS, XP, sync.
  - `voz.js` — síntesis y reconocimiento de voz, normalización y nota.
  - `datos.js` + `data/uNN.js` — las unidades. Para agregar una unidad nueva:
    crear `data/u13.js` con `CURSO.push({...})` y sumar su `<script>` en
    `index.html`. El esquema está comentado en `datos.js`.
- `worker/` — worker de Cloudflare `ingles` (progreso en KV + proxy de Groq).

## Despliegue

- Página: push a `main` (Pages sirve `docs/`).
- Worker: `npx wrangler deploy` desde `worker/`.
- Secretos del worker: `INGLES_PASE` (el pase del usuario) y `GROQ_API_KEY`
  (sin ella la IA responde 503 y el resto del curso funciona igual).
