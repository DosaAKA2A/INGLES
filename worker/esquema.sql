-- INGLES — esquema de D1 (cuentas, licencias y progreso).
--
-- Reglas que codifica este esquema:
--   - Se entra SOLO con el correo (código de 6 dígitos). No hay contraseñas.
--   - Cada cuenta tiene correo (login), nombre (lo elige el usuario) y codigo
--     (lo elige el sistema; sirve para soporte y para buscar en el backoffice,
--     NUNCA para entrar).
--   - Una licencia pertenece a UNA cuenta. Máximo 3 sesiones vivas por cuenta.
--   - Nada de claves en claro: de la licencia se guarda el SHA-256, del código
--     de acceso también, y de la sesión también.

CREATE TABLE IF NOT EXISTS usuarios (
  id      TEXT PRIMARY KEY,
  correo  TEXT NOT NULL UNIQUE,             -- normalizado a minúsculas
  nombre  TEXT NOT NULL DEFAULT '',
  codigo  TEXT NOT NULL UNIQUE,             -- 6 caracteres, alfabeto sin ambiguos
  rol     TEXT NOT NULL DEFAULT 'usuario',  -- usuario | admin
  estado  TEXT NOT NULL DEFAULT 'activa',   -- activa | bloqueada
  creado  INTEGER NOT NULL,
  visto   INTEGER NOT NULL DEFAULT 0
);

-- Código de acceso de un solo uso. Uno vivo por correo: pedir otro pisa el
-- anterior, así que un atacante no puede acumular intentos abriendo códigos.
CREATE TABLE IF NOT EXISTS codigos (
  correo   TEXT PRIMARY KEY,
  hash     TEXT NOT NULL,
  caduca   INTEGER NOT NULL,
  intentos INTEGER NOT NULL DEFAULT 0,
  creado   INTEGER NOT NULL
);

-- La cookie/token lleva el id en claro; acá se guarda su hash.
CREATE TABLE IF NOT EXISTS sesiones (
  hash       TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  creada     INTEGER NOT NULL,
  vista      INTEGER NOT NULL,
  caduca     INTEGER NOT NULL,
  ua         TEXT,
  pais       TEXT
);
CREATE INDEX IF NOT EXISTS ix_sesiones_usuario ON sesiones(usuario_id, vista DESC);

CREATE TABLE IF NOT EXISTS licencias (
  id         TEXT PRIMARY KEY,
  hash       TEXT NOT NULL UNIQUE,          -- SHA-256 de la clave en claro
  pista      TEXT NOT NULL,                 -- últimos 4 caracteres, para reconocerla
  tipo       TEXT NOT NULL DEFAULT 'premium',
  estado     TEXT NOT NULL DEFAULT 'libre', -- libre | activa | revocada
  usuario_id TEXT,
  pedido_id  TEXT,
  lote       TEXT,
  nota       TEXT,
  creada     INTEGER NOT NULL,
  activada   INTEGER,
  caduca     INTEGER                        -- NULL = sin caducidad
);
CREATE INDEX IF NOT EXISTS ix_licencias_usuario ON licencias(usuario_id);
CREATE INDEX IF NOT EXISTS ix_licencias_estado  ON licencias(estado, creada DESC);

-- Compra automática, entrega manual: el pago crea el pedido en 'pendiente' y
-- no pasa nada hasta que Dosa lo aprueba en el backoffice.
CREATE TABLE IF NOT EXISTS pedidos (
  id          TEXT PRIMARY KEY,
  correo      TEXT NOT NULL,
  nombre      TEXT,
  tipo        TEXT NOT NULL DEFAULT 'premium',
  importe     INTEGER,                      -- en céntimos
  moneda      TEXT NOT NULL DEFAULT 'EUR',
  pasarela    TEXT,                         -- stripe | paypal | manual | ...
  ref         TEXT,                         -- id del pago en la pasarela
  estado      TEXT NOT NULL DEFAULT 'pendiente', -- pendiente | aprobado | rechazado
  creado      INTEGER NOT NULL,
  resuelto    INTEGER,
  nota        TEXT,
  licencia_id TEXT
);
CREATE INDEX IF NOT EXISTS ix_pedidos_estado ON pedidos(estado, creado DESC);
CREATE INDEX IF NOT EXISTS ix_pedidos_correo ON pedidos(correo);

CREATE TABLE IF NOT EXISTS progreso (
  usuario_id  TEXT PRIMARY KEY,
  json        TEXT NOT NULL,
  actualizado INTEGER NOT NULL
);

-- Cuota diaria de IA. El gasto de Groq es lo único que puede dispararse.
CREATE TABLE IF NOT EXISTS uso_ia (
  usuario_id TEXT NOT NULL,
  dia        TEXT NOT NULL,                 -- YYYY-MM-DD en UTC
  llamadas   INTEGER NOT NULL DEFAULT 0,
  tokens     INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (usuario_id, dia)
);

-- Rate limit global. En D1 y no en el binding del worker porque el binding
-- cuenta por centro de datos: para lo caro hace falta un contador único.
CREATE TABLE IF NOT EXISTS limites (
  clave   TEXT PRIMARY KEY,
  cuenta  INTEGER NOT NULL DEFAULT 0,
  ventana INTEGER NOT NULL                  -- epoch en que el cubo expira
);
CREATE INDEX IF NOT EXISTS ix_limites_ventana ON limites(ventana);

CREATE TABLE IF NOT EXISTS eventos (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  ts      INTEGER NOT NULL,
  tipo    TEXT NOT NULL,
  quien   TEXT,
  detalle TEXT
);
CREATE INDEX IF NOT EXISTS ix_eventos_ts ON eventos(ts DESC);
