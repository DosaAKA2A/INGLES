/* INGLES — backoffice.
   ---------------------------------------------------------------------------
   Dos cerrojos, no uno: hace falta una sesion con rol 'admin' Y ademas el
   secreto ADMIN_PASE en la cabecera X-Admin-Pase. Con uno solo, quien se
   quedara con el buzon de correo de Dosa tendria la base de datos entera.

   La entrega es manual a proposito: el pago crea el pedido en 'pendiente' y
   la licencia no existe hasta que alguien la aprueba aca.
*/

import { ahora, sha256, igual, nuevoId, normalizaCorreo, correoValido } from './util.js';
import { generaClave } from './cuentas.js';
import { envia, plantillaLicencia, plantillaPedidoRechazado } from './correo.js';

export function esAdmin(req, env, usuario) {
  if (!usuario || usuario.rol !== 'admin') return false;
  const pase = req.headers.get('X-Admin-Pase') || '';
  return !!env.ADMIN_PASE && igual(pase, env.ADMIN_PASE.trim());
}

async function apunta(env, tipo, quien, detalle) {
  await env.DB.prepare('INSERT INTO eventos (ts, tipo, quien, detalle) VALUES (?1, ?2, ?3, ?4)')
    .bind(ahora(), tipo, quien, String(detalle || '').slice(0, 400)).run();
}

// Crea la fila de licencia y devuelve la clave EN CLARO. Es la unica vez que
// se puede leer: en la base solo queda el SHA-256.
async function creaLicencia(env, { tipo, dias, lote, nota, pedidoId }) {
  const clave = generaClave();
  const t = ahora();
  await env.DB.prepare(
    `INSERT INTO licencias (id, hash, pista, tipo, estado, lote, nota, creada, caduca, pedido_id)
     VALUES (?1, ?2, ?3, ?4, 'libre', ?5, ?6, ?7, ?8, ?9)`
  ).bind(
    nuevoId(), await sha256(clave), clave.slice(-4), tipo || 'premium',
    lote || null, nota || null, t, dias ? t + Number(dias) * 86400 : null, pedidoId || null
  ).run();
  return clave;
}

export async function ruta(env, req, url, usuario) {
  const p = url.pathname.replace(/^\/admin/, '');
  const met = req.method;
  const cuerpo = met === 'POST' ? await req.json().catch(() => ({})) : {};
  const ok = (c) => ({ estado: 200, cuerpo: c });

  // ---- panel --------------------------------------------------------------

  if (p === '/resumen' && met === 'GET') {
    const q = (s) => env.DB.prepare(s).first();
    const [us, pend, act, lib, ev] = await Promise.all([
      q('SELECT COUNT(*) n FROM usuarios'),
      q("SELECT COUNT(*) n FROM pedidos WHERE estado = 'pendiente'"),
      q("SELECT COUNT(*) n FROM licencias WHERE estado = 'activa'"),
      q("SELECT COUNT(*) n FROM licencias WHERE estado = 'libre'"),
      env.DB.prepare('SELECT * FROM eventos ORDER BY ts DESC LIMIT 15').all()
    ]);
    return ok({
      usuarios: us.n, pedidosPendientes: pend.n,
      licenciasActivas: act.n, licenciasLibres: lib.n,
      eventos: ev.results
    });
  }

  // ---- usuarios -----------------------------------------------------------

  if (p === '/usuarios' && met === 'GET') {
    const q = String(url.searchParams.get('q') || '').trim().toLowerCase();
    const filas = q
      ? await env.DB.prepare(
          `SELECT id, correo, nombre, codigo, rol, estado, creado, visto FROM usuarios
           WHERE lower(correo) LIKE ?1 OR lower(nombre) LIKE ?1 OR lower(codigo) = ?2
           ORDER BY creado DESC LIMIT 50`
        ).bind('%' + q + '%', q).all()
      : await env.DB.prepare(
          `SELECT id, correo, nombre, codigo, rol, estado, creado, visto FROM usuarios
           ORDER BY creado DESC LIMIT 50`
        ).all();
    return ok({ usuarios: filas.results });
  }

  if (p === '/usuario' && met === 'GET') {
    const id = url.searchParams.get('id');
    const u = await env.DB.prepare('SELECT * FROM usuarios WHERE id = ?1').bind(id).first();
    if (!u) return { estado: 404, cuerpo: { error: 'no existe' } };
    const [lic, ses, ped, pro] = await Promise.all([
      env.DB.prepare('SELECT id, pista, tipo, estado, activada, caduca, nota FROM licencias WHERE usuario_id = ?1').bind(id).all(),
      env.DB.prepare('SELECT creada, vista, caduca, ua, pais FROM sesiones WHERE usuario_id = ?1 ORDER BY vista DESC').bind(id).all(),
      env.DB.prepare('SELECT * FROM pedidos WHERE correo = ?1 ORDER BY creado DESC').bind(u.correo).all(),
      env.DB.prepare('SELECT actualizado, length(json) bytes FROM progreso WHERE usuario_id = ?1').bind(id).first()
    ]);
    return ok({ usuario: u, licencias: lic.results, sesiones: ses.results, pedidos: ped.results, progreso: pro || null });
  }

  if (p === '/usuario/estado' && met === 'POST') {
    const estado = cuerpo.estado === 'bloqueada' ? 'bloqueada' : 'activa';
    await env.DB.prepare('UPDATE usuarios SET estado = ?2 WHERE id = ?1').bind(cuerpo.id, estado).run();
    // Bloquear tiene que echar las sesiones abiertas, si no sigue dentro 30 dias.
    if (estado === 'bloqueada') {
      await env.DB.prepare('DELETE FROM sesiones WHERE usuario_id = ?1').bind(cuerpo.id).run();
    }
    await apunta(env, 'usuario.' + estado, usuario.correo, cuerpo.id);
    return ok({ ok: true, estado });
  }

  // ---- licencias ----------------------------------------------------------

  if (p === '/licencias' && met === 'GET') {
    const q = String(url.searchParams.get('q') || '').trim().toLowerCase();
    const filas = await env.DB.prepare(
      `SELECT l.id, l.pista, l.tipo, l.estado, l.lote, l.nota, l.creada, l.activada, l.caduca,
              u.correo, u.nombre, u.codigo
       FROM licencias l LEFT JOIN usuarios u ON u.id = l.usuario_id
       WHERE ?1 = '' OR lower(u.correo) LIKE ?2 OR lower(l.pista) = ?1 OR lower(l.lote) LIKE ?2
       ORDER BY l.creada DESC LIMIT 100`
    ).bind(q, '%' + q + '%').all();
    return ok({ licencias: filas.results });
  }

  // Genera un lote sin destinatario: las claves se devuelven una sola vez.
  if (p === '/licencias/generar' && met === 'POST') {
    const n = Math.min(Math.max(parseInt(cuerpo.cantidad, 10) || 1, 1), 50);
    const claves = [];
    for (let i = 0; i < n; i++) {
      claves.push(await creaLicencia(env, {
        tipo: cuerpo.tipo, dias: cuerpo.dias, lote: cuerpo.lote, nota: cuerpo.nota
      }));
    }
    await apunta(env, 'licencias.generadas', usuario.correo, n + ' de ' + (cuerpo.tipo || 'premium') + ' lote ' + (cuerpo.lote || '-'));
    return ok({ claves });
  }

  // Entrega directa: genera la licencia y la manda por correo. No hace falta
  // que la cuenta exista todavia; al entrar con ese correo la activa.
  if (p === '/licencias/entregar' && met === 'POST') {
    const correo = normalizaCorreo(cuerpo.correo);
    if (!correoValido(correo)) return { estado: 400, cuerpo: { error: 'correo no valido' } };
    const clave = await creaLicencia(env, { tipo: cuerpo.tipo, dias: cuerpo.dias, lote: cuerpo.lote, nota: 'entrega manual a ' + correo });
    const u = await env.DB.prepare('SELECT nombre FROM usuarios WHERE correo = ?1').bind(correo).first();
    const pl = plantillaLicencia(clave, u?.nombre);
    await envia(env, { para: correo, asunto: pl.asunto, html: pl.html, texto: pl.texto });
    await apunta(env, 'licencia.entregada', usuario.correo, correo + ' ' + clave.slice(-4));
    return ok({ ok: true, clave });
  }

  if (p === '/licencias/revocar' && met === 'POST') {
    await env.DB.prepare("UPDATE licencias SET estado = 'revocada', nota = ?2 WHERE id = ?1")
      .bind(cuerpo.id, String(cuerpo.motivo || 'revocada').slice(0, 200)).run();
    await apunta(env, 'licencia.revocada', usuario.correo, cuerpo.id + ': ' + (cuerpo.motivo || ''));
    return ok({ ok: true });
  }

  // ---- pedidos ------------------------------------------------------------

  if (p === '/pedidos' && met === 'GET') {
    const estado = url.searchParams.get('estado') || 'pendiente';
    const filas = await env.DB.prepare(
      `SELECT * FROM pedidos WHERE ?1 = 'todos' OR estado = ?1 ORDER BY creado DESC LIMIT 100`
    ).bind(estado).all();
    return ok({ pedidos: filas.results });
  }

  if (p === '/pedidos/aprobar' && met === 'POST') {
    const ped = await env.DB.prepare("SELECT * FROM pedidos WHERE id = ?1 AND estado = 'pendiente'")
      .bind(cuerpo.id).first();
    if (!ped) return { estado: 404, cuerpo: { error: 'ese pedido no esta pendiente' } };

    const clave = await creaLicencia(env, {
      tipo: ped.tipo, dias: cuerpo.dias, lote: 'pedido', nota: 'pedido ' + ped.id, pedidoId: ped.id
    });
    const lic = await env.DB.prepare('SELECT id FROM licencias WHERE hash = ?1').bind(await sha256(clave)).first();
    await env.DB.prepare("UPDATE pedidos SET estado = 'aprobado', resuelto = ?2, licencia_id = ?3, nota = ?4 WHERE id = ?1")
      .bind(ped.id, ahora(), lic.id, String(cuerpo.nota || '').slice(0, 200)).run();

    const pl = plantillaLicencia(clave, ped.nombre);
    await envia(env, { para: ped.correo, asunto: pl.asunto, html: pl.html, texto: pl.texto });
    await apunta(env, 'pedido.aprobado', usuario.correo, ped.correo + ' ' + clave.slice(-4));
    return ok({ ok: true, clave });
  }

  if (p === '/pedidos/rechazar' && met === 'POST') {
    const ped = await env.DB.prepare("SELECT * FROM pedidos WHERE id = ?1 AND estado = 'pendiente'")
      .bind(cuerpo.id).first();
    if (!ped) return { estado: 404, cuerpo: { error: 'ese pedido no esta pendiente' } };
    const motivo = String(cuerpo.motivo || '').slice(0, 200);
    await env.DB.prepare("UPDATE pedidos SET estado = 'rechazado', resuelto = ?2, nota = ?3 WHERE id = ?1")
      .bind(ped.id, ahora(), motivo).run();
    if (cuerpo.avisar !== false) {
      const pl = plantillaPedidoRechazado(motivo);
      await envia(env, { para: ped.correo, asunto: pl.asunto, html: pl.html, texto: pl.texto });
    }
    await apunta(env, 'pedido.rechazado', usuario.correo, ped.correo + ': ' + motivo);
    return ok({ ok: true });
  }

  // Alta manual de pedido, para cuando el pago llega por fuera de la pasarela
  // (transferencia, Yape, lo que sea) y hay que dejar constancia igual.
  if (p === '/pedidos/nuevo' && met === 'POST') {
    const correo = normalizaCorreo(cuerpo.correo);
    if (!correoValido(correo)) return { estado: 400, cuerpo: { error: 'correo no valido' } };
    const id = nuevoId();
    await env.DB.prepare(
      `INSERT INTO pedidos (id, correo, nombre, tipo, importe, moneda, pasarela, ref, estado, creado, nota)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'manual', ?7, 'pendiente', ?8, ?9)`
    ).bind(id, correo, cuerpo.nombre || null, cuerpo.tipo || 'premium',
      parseInt(cuerpo.importe, 10) || null, cuerpo.moneda || 'EUR',
      cuerpo.ref || null, ahora(), String(cuerpo.nota || '').slice(0, 200)).run();
    return ok({ ok: true, id });
  }

  if (p === '/eventos' && met === 'GET') {
    const filas = await env.DB.prepare('SELECT * FROM eventos ORDER BY ts DESC LIMIT 200').all();
    return ok({ eventos: filas.results });
  }

  return { estado: 404, cuerpo: { error: 'ruta de admin desconocida' } };
}
