/* INGLES — cuentas, sesiones y licencias.
   ---------------------------------------------------------------------------
   Se entra SOLO con el correo. Se pide un codigo de 6 digitos, llega al correo,
   se escribe y listo: eso crea la cuenta y la verifica en un mismo paso, asi
   que no existe el estado "registrado pero sin confirmar" ni el flujo de
   "olvide mi contrasena". Tampoco hay hash de contrasena que calcular, que en
   Workers seria PBKDF2 y se comeria el CPU del plan gratis.

   Cada cuenta tiene tres cosas:
     correo  -> es lo unico con lo que se entra
     nombre  -> lo elige el usuario, puede repetirse
     codigo  -> lo elige el sistema (6 caracteres). Sirve para soporte y para
                buscar en el backoffice. NO sirve para entrar.
*/

import {
  ALFABETO, azar, ahora, sha256, igual, nuevoId,
  normalizaCorreo, correoValido, limpiaNombre
} from './util.js';
import { limites, ip } from './limites.js';
import { envia, plantillaCodigo } from './correo.js';

const VIDA_CODIGO = 10 * 60;        // 10 minutos
const INTENTOS_CODIGO = 5;
const VIDA_SESION = 30 * 24 * 3600; // 30 dias
const MAX_SESIONES = 3;             // por cuenta; la cuarta echa a la mas vieja

// ---- codigo de acceso -----------------------------------------------------

export async function pideCodigo(env, req, cuerpo) {
  const correo = normalizaCorreo(cuerpo.correo);
  if (!correoValido(correo)) return { estado: 400, cuerpo: { error: 'correo no valido' } };

  const tope = await limites(env, [
    ['cod:correo:' + correo, 3, 3600],
    ['cod:ip:' + ip(req), 10, 3600],
    ['cod:ip:dia:' + ip(req), 30, 86400]
  ]);
  // La respuesta es la misma pase lo que pase: si dijeramos "ese correo no
  // existe" o "vas muy rapido", habriamos hecho un buscador de clientes.
  if (tope) return { estado: 200, cuerpo: { ok: true } };

  const codigo = azar(6);
  const t = ahora();
  await env.DB.prepare(
    `INSERT INTO codigos (correo, hash, caduca, intentos, creado) VALUES (?1, ?2, ?3, 0, ?4)
     ON CONFLICT(correo) DO UPDATE SET hash = ?2, caduca = ?3, intentos = 0, creado = ?4`
  ).bind(correo, await sha256(correo + ':' + codigo), t + VIDA_CODIGO, t).run();

  const p = plantillaCodigo(codigo, VIDA_CODIGO / 60);
  await envia(env, { para: correo, asunto: p.asunto, html: p.html, texto: p.texto });
  return { estado: 200, cuerpo: { ok: true } };
}

export async function verificaCodigo(env, req, cuerpo) {
  const correo = normalizaCorreo(cuerpo.correo);
  const codigo = String(cuerpo.codigo || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!correoValido(correo) || codigo.length !== 6) {
    return { estado: 400, cuerpo: { error: 'faltan datos' } };
  }

  const tope = await limites(env, [['ver:ip:' + ip(req), 20, 3600]]);
  if (tope) return { estado: 429, cuerpo: { error: 'demasiados intentos, espera un rato' } };

  const fila = await env.DB.prepare('SELECT * FROM codigos WHERE correo = ?1').bind(correo).first();
  const malo = { estado: 401, cuerpo: { error: 'codigo incorrecto o vencido' } };
  if (!fila || fila.caduca < ahora()) return malo;

  if (fila.intentos >= INTENTOS_CODIGO) {
    await env.DB.prepare('DELETE FROM codigos WHERE correo = ?1').bind(correo).run();
    return malo;
  }
  if (!igual(fila.hash, await sha256(correo + ':' + codigo))) {
    await env.DB.prepare('UPDATE codigos SET intentos = intentos + 1 WHERE correo = ?1').bind(correo).run();
    return malo;
  }

  // Acertado: el codigo se quema aunque despues falle algo.
  await env.DB.prepare('DELETE FROM codigos WHERE correo = ?1').bind(correo).run();

  const usuario = await dameOCreaUsuario(env, correo, cuerpo.nombre);
  if (usuario.estado === 'bloqueada') {
    return { estado: 403, cuerpo: { error: 'esta cuenta esta bloqueada' } };
  }

  const ses = await abreSesion(env, req, usuario.id);
  return {
    estado: 200,
    cuerpo: { token: ses.token, exp: ses.caduca, usuario: await perfil(env, usuario) },
    cookie: ses.token
  };
}

// ---- usuarios -------------------------------------------------------------

async function dameOCreaUsuario(env, correo, nombrePedido) {
  const ya = await env.DB.prepare('SELECT * FROM usuarios WHERE correo = ?1').bind(correo).first();
  if (ya) {
    await env.DB.prepare('UPDATE usuarios SET visto = ?2 WHERE id = ?1').bind(ya.id, ahora()).run();
    return ya;
  }
  const nombre = limpiaNombre(nombrePedido) || correo.split('@')[0].slice(0, 32);
  const t = ahora();
  // El codigo de usuario son 6 caracteres de 32: chocan de vez en cuando y
  // reintentar es mas barato que llevar un contador global.
  for (let i = 0; i < 6; i++) {
    const id = nuevoId();
    try {
      await env.DB.prepare(
        `INSERT INTO usuarios (id, correo, nombre, codigo, rol, estado, creado, visto)
         VALUES (?1, ?2, ?3, ?4, 'usuario', 'activa', ?5, ?5)`
      ).bind(id, correo, nombre, azar(6), t).run();
      return await env.DB.prepare('SELECT * FROM usuarios WHERE id = ?1').bind(id).first();
    } catch (e) {
      if (!String(e.message).includes('UNIQUE')) throw e;
      const otra = await env.DB.prepare('SELECT * FROM usuarios WHERE correo = ?1').bind(correo).first();
      if (otra) return otra; // dos pestanas pidiendo a la vez
    }
  }
  throw new Error('no se pudo crear la cuenta');
}

export async function perfil(env, usuario) {
  const lic = await licenciaDe(env, usuario.id);
  return {
    correo: usuario.correo,
    nombre: usuario.nombre,
    codigo: usuario.codigo,
    admin: usuario.rol === 'admin',
    licencia: lic ? { tipo: lic.tipo, pista: lic.pista, caduca: lic.caduca } : null,
    premium: !!lic && lic.tipo === 'premium'
  };
}

export async function cambiaNombre(env, usuarioId, nombre) {
  const limpio = limpiaNombre(nombre);
  if (!limpio) return { estado: 400, cuerpo: { error: 'el nombre no puede estar vacio' } };
  await env.DB.prepare('UPDATE usuarios SET nombre = ?2 WHERE id = ?1').bind(usuarioId, limpio).run();
  return { estado: 200, cuerpo: { ok: true, nombre: limpio } };
}

// ---- sesiones -------------------------------------------------------------

async function abreSesion(env, req, usuarioId) {
  const token = azar(10) + '.' + azar(32);
  const t = ahora();
  const caduca = t + VIDA_SESION;
  await env.DB.prepare(
    `INSERT INTO sesiones (hash, usuario_id, creada, vista, caduca, ua, pais)
     VALUES (?1, ?2, ?3, ?3, ?4, ?5, ?6)`
  ).bind(
    await sha256(token), usuarioId, t, caduca,
    (req.headers.get('User-Agent') || '').slice(0, 180),
    req.headers.get('CF-IPCountry') || null
  ).run();

  // Tope de 3 sesiones vivas por cuenta: la mas vieja cae sola. No limita
  // equipos (podes entrar desde donde quieras), limita cuantos a la vez.
  await env.DB.prepare(
    `DELETE FROM sesiones WHERE usuario_id = ?1 AND hash NOT IN (
       SELECT hash FROM sesiones WHERE usuario_id = ?1 ORDER BY vista DESC LIMIT ?2)`
  ).bind(usuarioId, MAX_SESIONES).run();

  return { token, caduca };
}

// Acepta la cookie (mismo dominio) o el Authorization: Bearer (cross-origin,
// que es lo que hace falta mientras la pagina viva en GitHub Pages).
export async function sesionDe(env, req) {
  const auth = req.headers.get('Authorization') || '';
  let token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) {
    const m = /(?:^|;\s*)ingles_sesion=([^;]+)/.exec(req.headers.get('Cookie') || '');
    if (m) token = decodeURIComponent(m[1]);
  }
  if (!token) return null;

  const fila = await env.DB.prepare(
    `SELECT s.hash AS s_hash, s.vista AS s_vista, s.caduca AS s_caduca, u.*
     FROM sesiones s JOIN usuarios u ON u.id = s.usuario_id WHERE s.hash = ?1`
  ).bind(await sha256(token)).first();
  if (!fila || fila.s_caduca < ahora() || fila.estado === 'bloqueada') return null;

  // Renovar en cada peticion seria una escritura por request. Se toca la
  // sesion como mucho una vez por hora.
  if (ahora() - (fila.s_vista || 0) > 3600) {
    await env.DB.prepare('UPDATE sesiones SET vista = ?2, caduca = ?3 WHERE hash = ?1')
      .bind(fila.s_hash, ahora(), ahora() + VIDA_SESION).run();
  }
  return fila;
}

export async function cierraSesion(env, req) {
  const auth = req.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (token) await env.DB.prepare('DELETE FROM sesiones WHERE hash = ?1').bind(await sha256(token)).run();
  return { estado: 200, cuerpo: { ok: true }, cookie: '' };
}

// ---- licencias ------------------------------------------------------------
//
// Formato: INGL-XXXX-XXXX-XXXX. Doce caracteres del alfabeto de 32: once al
// azar (55 bits) y el ultimo de control. Ese ultimo deja rechazar una errata
// sin consultar la base y sin gastar intento de rate limit.

function control(once) {
  let s = 0;
  for (const c of once) s += ALFABETO.indexOf(c);
  return ALFABETO[s % 32];
}

export function generaClave() {
  const cuerpo = azar(11);
  const doce = cuerpo + control(cuerpo);
  return 'INGL-' + doce.slice(0, 4) + '-' + doce.slice(4, 8) + '-' + doce.slice(8, 12);
}

export function normalizaClave(v) {
  let s = String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (s.startsWith('INGL')) s = s.slice(4);
  if (s.length !== 12) return null;
  for (const c of s) if (!ALFABETO.includes(c)) return null;
  if (s[11] !== control(s.slice(0, 11))) return null;
  return 'INGL-' + s.slice(0, 4) + '-' + s.slice(4, 8) + '-' + s.slice(8, 12);
}

export async function licenciaDe(env, usuarioId) {
  return await env.DB.prepare(
    `SELECT * FROM licencias
     WHERE usuario_id = ?1 AND estado = 'activa' AND (caduca IS NULL OR caduca > ?2)
     ORDER BY CASE tipo WHEN 'premium' THEN 0 ELSE 1 END LIMIT 1`
  ).bind(usuarioId, ahora()).first();
}

export async function activaLicencia(env, req, usuario, cuerpo) {
  const clave = normalizaClave(cuerpo.clave);
  if (!clave) return { estado: 400, cuerpo: { error: 'esa clave no tiene el formato correcto' } };

  const tope = await limites(env, [
    ['lic:cuenta:' + usuario.id, 5, 3600],
    ['lic:ip:' + ip(req), 20, 86400]
  ]);
  if (tope) return { estado: 429, cuerpo: { error: 'demasiados intentos, prueba en un rato' } };

  const lic = await env.DB.prepare('SELECT * FROM licencias WHERE hash = ?1')
    .bind(await sha256(clave)).first();
  if (!lic) return { estado: 404, cuerpo: { error: 'esa licencia no existe' } };
  if (lic.estado === 'revocada') return { estado: 403, cuerpo: { error: 'esa licencia fue anulada' } };
  if (lic.estado === 'activa') {
    return lic.usuario_id === usuario.id
      ? { estado: 200, cuerpo: { ok: true, ya: true, licencia: { tipo: lic.tipo, pista: lic.pista, caduca: lic.caduca } } }
      : { estado: 409, cuerpo: { error: 'esa licencia ya esta en uso en otra cuenta' } };
  }

  const t = ahora();
  // El WHERE estado = 'libre' es la carrera: si llegan dos peticiones juntas,
  // solo una cambia la fila y la otra ve changes = 0.
  const r = await env.DB.prepare(
    `UPDATE licencias SET estado = 'activa', usuario_id = ?2, activada = ?3
     WHERE id = ?1 AND estado = 'libre'`
  ).bind(lic.id, usuario.id, t).run();
  if (!r.meta.changes) return { estado: 409, cuerpo: { error: 'esa licencia ya esta en uso' } };

  await env.DB.prepare('INSERT INTO eventos (ts, tipo, quien, detalle) VALUES (?1, ?2, ?3, ?4)')
    .bind(t, 'licencia.activada', usuario.correo, lic.pista + ' (' + lic.tipo + ')').run();

  return { estado: 200, cuerpo: { ok: true, licencia: { tipo: lic.tipo, pista: lic.pista, caduca: lic.caduca } } };
}
