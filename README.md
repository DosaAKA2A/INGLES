# Verby

Curso de inglés desde cero (A0 → A1), como web interactiva. Sin frameworks y
sin dependencias: HTML, CSS y JS planos servidos por GitHub Pages, más un
worker de Cloudflare para las cuentas, las licencias, el progreso y la IA.

El repositorio se sigue llamando `INGLES` y el worker `ingles`; el producto es
Verby.

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

El audio del curso va pregrabado; el texto dinámico usa la voz neuronal del
worker y cae al sintetizador del navegador si esa no está.

## Cuentas y licencias

- Se entra **solo con el correo**: un código de 6 caracteres, de un solo uso y
  10 minutos de vida. Ese código crea y verifica la cuenta a la vez, así que no
  hay contraseñas ni "olvidé mi contraseña".
- Cada cuenta tiene correo (login), nombre (lo elige quien se registra) y un
  código de 6 caracteres que elige el sistema, para soporte y búsqueda.
- Máximo **3 sesiones vivas** por cuenta: la cuarta echa a la más vieja.
- La **IA es premium**: pide licencia premium activa. El resto del curso
  funciona sin cuenta y sin licencia.
- Las licencias (`INGL-XXXX-XXXX-XXXX`) se guardan hasheadas: una clave recién
  generada **se ve una sola vez**.
- La venta es automática y la entrega manual: el pago deja un pedido pendiente
  y no se entrega nada hasta aprobarlo en el panel.

## Estructura

- `docs/` — la página (GitHub Pages sirve esta carpeta).
  - `app.js` — el motor: vistas, corredor de ejercicios, SRS, XP, cuentas.
  - `voz.js` — síntesis y reconocimiento de voz, normalización y nota.
  - `lecciones.js` — el formato nuevo de lecciones (PPP).
  - `datos.js` + `data/uNN.js` — las unidades. Para agregar una unidad nueva:
    crear `data/u13.js` con `CURSO.push({...})` y sumar su `<script>` en
    `index.html`. El esquema está comentado en `datos.js`.
  - `panel.html` — el backoffice: pedidos, usuarios y licencias.
  - `logo.svg`, `verby.svg` y sus versiones en blanco — la marca.
- `worker/` — worker de Cloudflare `ingles`.
  - `esquema.sql` — las 9 tablas de D1.
  - `cuentas.js`, `admin.js`, `correo.js`, `limites.js`, `ia.js`, `util.js`.

## Despliegue

- Página: push a `main` (Pages sirve `docs/`).
- Worker: `npx wrangler deploy` desde `worker/`.
- Base de datos: `npx wrangler d1 execute ingles --remote --file=esquema.sql`.

Secretos del worker:

| Secreto | Para qué |
|---|---|
| `GROQ_API_KEY` | la IA; sin ella `/ia/*` responde 503 y el resto sigue igual |
| `CORREO_PROVEEDOR` | `brevo`, `resend` o `consola` (esta solo para pruebas) |
| `CORREO_CLAVE` | la api key del proveedor |
| `CORREO_REMITENTE` | la dirección que firma, de un dominio verificado |
| `CORREO_NOMBRE` | opcional, el nombre visible |
| `ADMIN_PASE` | segundo cerrojo del panel, además del rol de admin |
| `VOZ_CLAVE` | el relevo de voz de la VM |
| `MIGRA_CORREO` | opcional: a qué cuenta se entrega el progreso viejo de KV |

La variable `ORIGENES` de `wrangler.toml` dice quién puede llamar al worker.
Cuando el curso tenga dominio propio se agrega ahí.

La primera cuenta de admin se marca a mano:

```
npx wrangler d1 execute ingles --remote \
  --command "UPDATE usuarios SET rol='admin' WHERE correo='tu@correo.com'"
```

## El sitio

- Producción: **Cloudflare Pages**, proyecto `verby` → `verby-cgv.pages.dev`,
  y `verby.cloud` en cuanto propaguen los nameservers.
  Se publica con `npx wrangler pages deploy docs --project-name verby --branch main`.
- GitHub Pages sigue sirviendo `docs/` en `dosaaka2a.github.io/INGLES` mientras
  dure la mudanza; los dos orígenes están en `ORIGENES`.
- Ojo: Pages sirve las rutas sin extensión. El panel es `/panel`, no
  `/panel.html` (esa devuelve un 308 al primero).
