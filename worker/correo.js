/* INGLES — envio de correo.
   ---------------------------------------------------------------------------
   Adaptador de un solo proveedor a la vez. Cambiar de uno a otro es cambiar el
   secreto CORREO_PROVEEDOR: no hay nada mas atado a Brevo ni a Resend.

   Secretos:
     CORREO_PROVEEDOR   brevo | resend        (por defecto brevo)
     CORREO_CLAVE       la api key
     CORREO_REMITENTE   la direccion que firma (dominio verificado)
     CORREO_NOMBRE      el nombre visible     (por defecto "Curso de inglés")

   Ojo con Resend: hasta que el dominio no esta verificado solo deja enviar a
   la direccion del dueno de la cuenta, y todo lo demas falla con 403. Es la
   causa mas comun de "dejo de funcionar de un dia para otro".
*/

const PROVEEDORES = {
  // Solo para `wrangler dev`: escribe el correo en la consola en vez de
  // mandarlo, que es la unica forma de probar el flujo de codigos sin gastar
  // envios. Si alguien lo dejara puesto en produccion el resultado seria que
  // nadie puede entrar, no una fuga: el log del worker no es publico.
  async consola(env, { para, asunto, texto }) {
    console.log('[correo:consola] para=' + para + ' asunto=' + asunto + '\n' + texto);
  },

  async brevo(env, { para, asunto, html, texto }) {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': env.CORREO_CLAVE,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        sender: { email: env.CORREO_REMITENTE, name: env.CORREO_NOMBRE || 'Curso de inglés' },
        to: [{ email: para }],
        subject: asunto,
        htmlContent: html,
        textContent: texto
      })
    });
    if (!r.ok) throw new Error('brevo ' + r.status + ': ' + (await r.text().catch(() => '')).slice(0, 200));
  },

  async resend(env, { para, asunto, html, texto }) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + env.CORREO_CLAVE, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: (env.CORREO_NOMBRE || 'Curso de inglés') + ' <' + env.CORREO_REMITENTE + '>',
        to: [para],
        subject: asunto,
        html,
        text: texto
      })
    });
    if (!r.ok) throw new Error('resend ' + r.status + ': ' + (await r.text().catch(() => '')).slice(0, 200));
  }
};

export async function envia(env, mensaje) {
  const cual = (env.CORREO_PROVEEDOR || 'brevo').toLowerCase();
  if (cual !== 'consola' && (!env.CORREO_CLAVE || !env.CORREO_REMITENTE)) {
    throw new Error('correo sin configurar');
  }
  const fn = PROVEEDORES[cual];
  if (!fn) throw new Error('proveedor de correo desconocido: ' + cual);
  await fn(env, mensaje);
}

// ---- plantillas -----------------------------------------------------------
// Sin emojis y sin imagenes remotas: los filtros de spam castigan las dos cosas
// y un correo que no llega es una cuenta que no se crea.

const marco = (titulo, cuerpo) => `<!doctype html><html lang="es"><body style="margin:0;padding:24px;background:#f4f5f7;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1c1e21">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:14px;padding:32px">
<tr><td style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#8a8f98;padding-bottom:18px">Curso de inglés</td></tr>
<tr><td style="font-size:21px;font-weight:600;padding-bottom:14px">${titulo}</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#3c4149">${cuerpo}</td></tr>
<tr><td style="padding-top:26px;border-top:1px solid #e6e8eb;margin-top:26px;font-size:12px;line-height:1.5;color:#8a8f98">
Si no pediste esto, ignora el mensaje: sin el código nadie entra a tu cuenta.</td></tr>
</table></td></tr></table></body></html>`;

export function plantillaCodigo(codigo, minutos) {
  return {
    asunto: codigo + ' es tu código de acceso',
    texto: 'Tu código de acceso es ' + codigo + '. Vence en ' + minutos +
      ' minutos y sirve una sola vez.\n\nSi no lo pediste, ignora este mensaje.',
    html: marco('Tu código de acceso',
      `<p style="margin:0 0 18px">Escríbelo en la página para entrar. Vence en ${minutos} minutos y sirve una sola vez.</p>
       <div style="font-size:34px;font-weight:700;letter-spacing:.32em;text-align:center;padding:18px;background:#f4f5f7;border-radius:10px">${codigo}</div>`)
  };
}

export function plantillaLicencia(clave, nombre) {
  return {
    asunto: 'Tu licencia del curso de inglés',
    texto: 'Hola' + (nombre ? ' ' + nombre : '') + ', tu licencia es ' + clave +
      '.\n\nEntra a tu cuenta, abre Licencia y pégala ahí. Queda unida a tu cuenta para siempre.',
    html: marco('Tu licencia está lista',
      `<p style="margin:0 0 18px">Hola${nombre ? ' ' + nombre : ''}. Entra a tu cuenta, abre <b>Licencia</b> y pega esta clave:</p>
       <div style="font-size:20px;font-weight:700;letter-spacing:.10em;text-align:center;padding:18px;background:#f4f5f7;border-radius:10px;word-break:break-all">${clave}</div>
       <p style="margin:18px 0 0">Al activarla queda unida a tu cuenta. Guárdala igual, por si algún día hay que verificarla.</p>`)
  };
}

export function plantillaPedidoRechazado(motivo) {
  return {
    asunto: 'No pudimos entregar tu licencia',
    texto: 'Revisamos tu compra y no pudimos entregarte la licencia.\n\n' +
      (motivo || 'No se pudo confirmar el pago.') + '\n\nSi crees que es un error, responde a este correo.',
    html: marco('No pudimos entregar tu licencia',
      `<p style="margin:0 0 12px">Revisamos tu compra y no pudimos entregarte la licencia.</p>
       <p style="margin:0 0 12px;color:#1c1e21"><b>${motivo || 'No se pudo confirmar el pago.'}</b></p>
       <p style="margin:0">Si crees que es un error, responde a este correo y lo miramos.</p>`)
  };
}
