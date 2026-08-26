/* INGLES — worker del curso de ingles.
   ---------------------------------------------------------------------------
   Cuentas, licencias, progreso y la parte de IA. Todo lo que hay detras vive
   en D1 (ver esquema.sql); KV solo queda para migrar el progreso viejo.

   Publico:
     GET  /health
     POST /auth/codigo   {correo}                 -> manda el codigo al correo
     POST /auth/entrar   {correo, codigo, nombre} -> crea/abre la cuenta
     POST /pedido        {correo, nombre, tipo}   -> deja un pedido PENDIENTE
   Con sesion (Authorization: Bearer <token> o cookie ingles_sesion):
     POST /auth/salir
     GET  /yo                                     -> perfil + licencia
     POST /yo/nombre     {nombre}
     POST /licencia      {clave}                  -> activa una licencia
     GET  /progreso  |  PUT /progreso
   Con licencia premium activa:
     POST /ia/ensayo | /ia/chat | /ia/voz | /ia/oido
   Con sesion de admin + cabecera X-Admin-Pase:
     /admin/*                                     -> ver admin.js

   Secretos:
     npx wrangler secret put GROQ_API_KEY      (sin ella /ia/* responde 503)
     npx wrangler secret put CORREO_CLAVE      (api key del proveedor)
     npx wrangler secret put CORREO_REMITENTE  (direccion del dominio verificado)
     npx wrangler secret put CORREO_PROVEEDOR  (brevo | resend; brevo por defecto)
     npx wrangler secret put CORREO_NOMBRE     (opcional)
     npx wrangler secret put ADMIN_PASE        (segundo cerrojo del backoffice)
     npx wrangler secret put VOZ_CLAVE         (relevo de voz en la VM de GCP)
     npx wrangler secret put MIGRA_CORREO      (opcional: a que cuenta va el
                                                progreso viejo que quedo en KV)

   Variable (en wrangler.toml, no es secreto):
     ORIGENES  los origenes que pueden llamar al worker, separados por comas.
               Cuando el curso tenga dominio propio se agrega ahi y ya.
*/

import { ahora, nuevoId, normalizaCorreo, correoValido, limpiaNombre } from './util.js';
import { limites, ip, barreVencidos } from './limites.js';
import {
  pideCodigo, verificaCodigo, cierraSesion, sesionDe, perfil,
  cambiaNombre, activaLicencia, licenciaDe
} from './cuentas.js';
import * as ia from './ia.js';
import * as admin from './admin.js';

// El comodin en Access-Control-Allow-Origin ya no vale: con cuentas de por
// medio, cualquier pagina podria llamar al worker con el token de la victima.
//
// La lista sale de la variable ORIGENES (separados por comas) para que el dia
// que el curso tenga dominio propio sea un cambio de configuracion y no de
// codigo. El primero de la lista es el que se responde cuando el Origin no
// esta permitido: da igual cual sea, el navegador lo rechaza igual.
const ORIGENES_POR_DEFECTO = [
  'https://dosaaka2a.github.io',
  'http://localhost:8080',
  'http://127.0.0.1:8080'
];

function cabecerasCors(req, env) {
  const lista = (env.ORIGENES || '').split(',').map((s) => s.trim()).filter(Boolean);
  const origenes = lista.length ? lista : ORIGENES_POR_DEFECTO;
  const origen = req.headers.get('Origin') || '';
  const permitido = origenes.includes(origen) ? origen : origenes[0];
  return {
    'Access-Control-Allow-Origin': permitido,
    'Access-Control-Allow-Methods': 'GET,PUT,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization,Content-Type,X-Admin-Pase',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}

// La cookie es para cuando la pagina viva en el mismo dominio que el worker.
// Mientras siga en GitHub Pages manda el Bearer; dejarla puesta no molesta.
function cookieSesion(token) {
  const base = '; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=';
  return token
    ? 'ingles_sesion=' + encodeURIComponent(token) + base + 30 * 24 * 3600
    : 'ingles_sesion=' + base + '0';
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const cors = cabecerasCors(req, env);
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

    const json = (obj, estado = 200, extra = {}) => new Response(JSON.stringify(obj), {
      status: estado,
      headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors, ...extra }
    });
    const crudo = (texto) => new Response(texto, {
      headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors }
    });
    const resp = (r) => json(r.cuerpo, r.estado,
      r.cookie === undefined ? {} : { 'Set-Cookie': cookieSesion(r.cookie) });

    try {
      if (url.pathname === '/health') return json({ ok: true });

      // ---- publico --------------------------------------------------------

      if (url.pathname === '/auth/codigo' && req.method === 'POST') {
        return resp(await pideCodigo(env, req, await req.json().catch(() => ({}))));
      }
      if (url.pathname === '/auth/entrar' && req.method === 'POST') {
        return resp(await verificaCodigo(env, req, await req.json().catch(() => ({}))));
      }

      // Un pedido no entrega nada: queda pendiente hasta que Dosa lo aprueba
      // en el backoffice. Es el punto donde entrara el webhook de la pasarela
      // cuando este elegida; hoy sirve para dejar constancia de la intencion.
      if (url.pathname === '/pedido' && req.method === 'POST') {
        const c = await req.json().catch(() => ({}));
        const correo = normalizaCorreo(c.correo);
        if (!correoValido(correo)) return json({ error: 'correo no válido' }, 400);
        const tope = await limites(env, [
          ['ped:ip:' + ip(req), 5, 3600],
          ['ped:correo:' + correo, 3, 86400]
        ]);
        if (tope) return json({ error: 'demasiados pedidos, espera un rato' }, 429);
        const id = nuevoId();
        await env.DB.prepare(
          `INSERT INTO pedidos (id, correo, nombre, tipo, moneda, pasarela, estado, creado)
           VALUES (?1, ?2, ?3, ?4, 'EUR', 'web', 'pendiente', ?5)`
        ).bind(id, correo, limpiaNombre(c.nombre) || null,
          c.tipo === 'basica' ? 'basica' : 'premium', ahora()).run();
        return json({ ok: true, id });
      }

      // ---- desde aca hace falta sesion ------------------------------------

      const usuario = await sesionDe(env, req);
      if (!usuario) return json({ error: 'hace falta entrar' }, 401);

      if (url.pathname === '/auth/salir' && req.method === 'POST') {
        return resp(await cierraSesion(env, req));
      }
      if (url.pathname === '/yo' && req.method === 'GET') {
        return json(await perfil(env, usuario));
      }
      if (url.pathname === '/yo/nombre' && req.method === 'POST') {
        return resp(await cambiaNombre(env, usuario.id, (await req.json().catch(() => ({}))).nombre));
      }
      if (url.pathname === '/licencia' && req.method === 'POST') {
        return resp(await activaLicencia(env, req, usuario, await req.json().catch(() => ({}))));
      }

      // ---- progreso -------------------------------------------------------

      if (url.pathname === '/progreso' && req.method === 'GET') {
        const fila = await env.DB.prepare('SELECT json FROM progreso WHERE usuario_id = ?1')
          .bind(usuario.id).first();
        if (fila) return crudo(fila.json);

        // Migracion de la epoca de un solo usuario: el progreso vivia en una
        // unica clave de KV. Se le entrega a la cuenta que diga MIGRA_CORREO.
        if (env.MIGRA_CORREO && normalizaCorreo(env.MIGRA_CORREO) === usuario.correo) {
          const viejo = await env.INGLES_KV.get('progreso');
          if (viejo) {
            await env.DB.prepare(
              'INSERT OR REPLACE INTO progreso (usuario_id, json, actualizado) VALUES (?1, ?2, ?3)'
            ).bind(usuario.id, viejo, ahora()).run();
            return crudo(viejo);
          }
        }
        return crudo('null');
      }

      if (url.pathname === '/progreso' && req.method === 'PUT') {
        const tope = await limites(env, [['prog:' + usuario.id, 200, 3600]]);
        if (tope) return json({ error: 'demasiadas sincronizaciones' }, 429);
        const cuerpo = await req.text();
        if (cuerpo.length > 256 * 1024) return json({ error: 'demasiado grande' }, 413);
        // Se valida sin dejar salir el mensaje de JSON.parse: dice mas de la
        // cocina que del error, y al cliente no le sirve de nada.
        try { JSON.parse(cuerpo); } catch (e) { return json({ error: 'eso no es JSON' }, 400); }
        await env.DB.prepare(
          'INSERT OR REPLACE INTO progreso (usuario_id, json, actualizado) VALUES (?1, ?2, ?3)'
        ).bind(usuario.id, cuerpo, ahora()).run();
        return json({ ok: true });
      }

      // ---- IA: solo con licencia premium activa ---------------------------

      if (url.pathname.startsWith('/ia/')) {
        const lic = await licenciaDe(env, usuario.id);
        if (!lic || lic.tipo !== 'premium') {
          return json({
            error: 'premium',
            detalle: 'la práctica con IA necesita una licencia premium activa'
          }, 402);
        }
        return await ia.ruta(env, req, url, usuario, cors);
      }

      // ---- backoffice -----------------------------------------------------

      if (url.pathname.startsWith('/admin')) {
        // 404 y no 403: quien no es admin no tiene por que saber que existe.
        if (!admin.esAdmin(req, env, usuario)) return json({ error: 'no existe' }, 404);
        return resp(await admin.ruta(env, req, url, usuario));
      }

      return json({ error: 'no existe' }, 404);
    } catch (e) {
      return json({ error: String(e.message || e).slice(0, 300) }, 500);
    }
  },

  // Limpieza diaria: codigos vencidos, sesiones muertas y cubos de limite.
  async scheduled(evento, env, ctx) {
    ctx.waitUntil(barreVencidos(env));
  }
};
