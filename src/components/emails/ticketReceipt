// src/emails/ticketReceipt.js
export function renderTicketEmail({ purchase, event, reservation, toName }) {
  const fmt = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  });

  const today = new Date();
  const todayStr = today.toLocaleDateString("es-CL");

  const eventName = event?.name || "Evento";
  const eventDate = event?.date
    ? new Date(event.date).toLocaleString("es-CL", {
        dateStyle: "full",
        timeStyle: "short",
      })
    : "";
  const eventLocation = event?.location || "";
  const eventCategory = event?.category || "";
  const imageUrl = event?.image || "";

  const total =
    purchase?.total_price ??
    purchase?.total ??
    purchase?.amount ??
    0;

  // 👇 FUENTE PRINCIPAL: purchase.items
  // si viene vacío, usamos reservation.items
  const rawItems =
    (Array.isArray(purchase?.items) && purchase.items.length
      ? purchase.items
      : Array.isArray(reservation?.items)
      ? reservation.items
      : []) || [];

  const items = rawItems.map((item) => {
    const type =
      item.type ||
      item.ticket_type ||
      item.name ||
      "Entrada";

    const qty = Number(item.quantity ?? item.qty ?? 1) || 1;
    const unit = Number(item.price ?? item.unit_price ?? 0) || 0;
    const subtotal = unit * qty;

    return { type, qty, unit, subtotal };
  });

  const rowsResumen = items.length
    ? items
        .map(
          (it) => `
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${it.type}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${it.qty}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${fmt.format(
              it.unit
            )}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${fmt.format(
              it.subtotal
            )}</td>
          </tr>`
        )
        .join("")
    : `
      <tr>
        <td colspan="4" style="padding:12px 16px;text-align:center;color:#6b7280;">
          Sin detalle de ítems
        </td>
      </tr>
    `;

  const totalRow = `
    <tr>
      <td colspan="3" style="padding:10px 16px;text-align:right;font-weight:600;border-top:1px solid #e5e7eb;">
        Total
      </td>
      <td style="padding:10px 16px;text-align:right;font-weight:700;border-top:1px solid #e5e7eb;">
        ${fmt.format(total)} CLP
      </td>
    </tr>
  `;

  const heroImage = imageUrl
    ? `
    <tr>
      <td style="padding:0;">
        <img src="${imageUrl}"
             alt="${eventName}"
             style="display:block;width:100%;max-height:260px;object-fit:cover;" />
      </td>
    </tr>
  `
    : "";

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>TicketNow - Confirmación de compra</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f3f4f6;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;background:#ffffff;border-radius:8px;overflow:hidden;">
            <!-- Header oscuro -->
            <tr>
              <td style="background:#020617;padding:20px 24px;color:#f9fafb;">
                <div style="font-size:20px;font-weight:700;">TicketNow</div>
                <div style="font-size:13px;color:#e5e7eb;margin-top:4px;">${todayStr}</div>
              </td>
            </tr>

            <!-- Imagen grande del evento -->
            ${heroImage}

            <!-- Contenido -->
            <tr>
              <td style="padding:24px;">
                <h1 style="margin:0 0 8px 0;font-size:22px;color:#111827;">
                  Gracias por tu compra, ${toName || "Cliente"}!
                </h1>
                <p style="margin:0 0 18px 0;font-size:14px;color:#4b5563;">
                  Adjuntamos el resumen de tu orden y el detalle de cada entrada.
                  Presenta este correo el día del evento.
                </p>

                <!-- Tarjeta del evento -->
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-radius:8px;border:1px solid #e5e7eb;padding:14px 16px;margin-bottom:22px;">
                  <tr>
                    <td>
                      <div style="font-size:16px;font-weight:600;color:#111827;margin-bottom:6px;">
                        ${eventName}
                      </div>
                      ${
                        eventDate
                          ? `<div style="font-size:14px;color:#374151;margin-bottom:2px;">
                               Fecha: ${eventDate}
                             </div>`
                          : ""
                      }
                      ${
                        eventLocation
                          ? `<div style="font-size:14px;color:#374151;margin-bottom:2px;">
                               Lugar: ${eventLocation}
                             </div>`
                          : ""
                      }
                      ${
                        eventCategory
                          ? `<div style="font-size:13px;color:#6b7280;">
                               Categoría: ${eventCategory}
                             </div>`
                          : ""
                      }
                    </td>
                  </tr>
                </table>

                <!-- Resumen de la compra -->
                <h2 style="margin:0 0 10px 0;font-size:16px;color:#111827;">
                  Resumen de la compra
                </h2>

                <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
                  <thead style="background:#f9fafb;">
                    <tr>
                      <th align="left" style="padding:8px 12px;font-size:13px;color:#6b7280;">Tipo</th>
                      <th align="center" style="padding:8px 12px;font-size:13px;color:#6b7280;">Cantidad</th>
                      <th align="right" style="padding:8px 12px;font-size:13px;color:#6b7280;">Precio unit.</th>
                      <th align="right" style="padding:8px 12px;font-size:13px;color:#6b7280;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rowsResumen}
                    ${totalRow}
                  </tbody>
                </table>

                <p style="margin:20px 0 0 0;font-size:13px;color:#6b7280;">
                  Si no reconoces esta compra o necesitas ayuda, responde a este correo y nuestro equipo te asistirá.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:14px 24px 18px 24px;background:#f9fafb;font-size:12px;color:#9ca3af;text-align:center;">
                TicketNow © ${today.getFullYear()} — Gracias por tu compra.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
