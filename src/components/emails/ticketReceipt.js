// src/emails/ticketReceipt.js

// Utilidades
const fmtCLP = (n) => (Number(n) || 0).toLocaleString("es-CL");

const norm = (s) =>
  String(s ?? "")
    .normalize("NFKC")
    .trim()
    .toLowerCase();

// Mapa {type -> price} desde event.tickets (normalizado)
function buildPriceMap(event) {
  const map = {};
  (event?.tickets || []).forEach((t) => {
    if (t?.type != null) {
      map[norm(t.type)] = Number(t.price) || 0;
    }
  });
  return map;
}

// Convierte purchase.items o reservationItems a filas con price unit/subtotal
function buildLineItems({ purchase, reservationItems, priceMap }) {
  // 1) Preferir purchase.items si vienen (algunos backends lo traen)
  let raw = Array.isArray(purchase?.items) ? purchase.items : [];

  // 2) Si no hay, usar los items de la reserva que le pasamos desde Checkout
  if (!raw.length && Array.isArray(reservationItems)) {
    raw = reservationItems;
  }

  // Normaliza cada ítem
  const items = raw.map((it) => {
    const t = it?.type ?? "-";
    const q = Math.max(1, Number(it?.quantity || 1));
    // Si no viene price, lo buscamos por tipo en el event.tickets
    const unit = it?.price != null ? Number(it.price) : priceMap[norm(t)] ?? 0;

    return {
      type: t,
      quantity: q,
      unitPrice: unit,
      subtotal: unit * q,
      // algunos backends traen códigos por item
      codes: Array.isArray(it?.codes) ? it.codes : null,
    };
  });

  return items;
}

// Expande a filas "por entrada" (1 fila por ticket)
function expandPerTicket(items, purchase) {
  const seed = String(
    purchase?.id || purchase?._id || purchase?.reservation_id || "ORDER"
  )
    .slice(-6)
    .toUpperCase();

  const rows = [];
  items.forEach((it) => {
    for (let i = 0; i < it.quantity; i++) {
      const code =
        it.codes?.[i] ||
        `${norm(it.type).replace(/\s+/g, "").toUpperCase()}-${String(
          i + 1
        ).padStart(2, "0")}-${seed}`;
      rows.push({
        idx: rows.length + 1,
        type: it.type,
        price: it.unitPrice,
        code,
      });
    }
  });
  return rows;
}

export function renderTicketEmail({
  purchase = {},
  event = {},
  toName = "",
  reservationItems = [],
}) {
  const priceMap = buildPriceMap(event);
  const items = buildLineItems({ purchase, reservationItems, priceMap });
  const perTicket = expandPerTicket(items, purchase);

  const computedTotal = items.reduce((a, it) => a + it.subtotal, 0);
  const total =
    purchase?.total_price != null
      ? Number(purchase.total_price)
      : computedTotal;

  const eventDate = event?.date
    ? new Date(event.date).toLocaleString("es-CL", {
        dateStyle: "full",
        timeStyle: "short",
      })
    : "Fecha por confirmar";

  const buyerName = toName?.trim() ? `, ${toName.trim()}` : "";

  const itemsRows = items.length
    ? items
        .map(
          (it) => `
      <tr>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;">${it.type}</td>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;text-align:center;">${
          it.quantity
        }</td>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;text-align:right;">$${fmtCLP(
          it.unitPrice
        )}</td>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;text-align:right;">$${fmtCLP(
          it.subtotal
        )}</td>
      </tr>
    `
        )
        .join("")
    : `<tr><td colspan="4" style="padding:12px;border:1px solid #e5e7eb;text-align:center;color:#6b7280;">Sin ítems</td></tr>`;

  const ticketRows = perTicket.length
    ? perTicket
        .map(
          (t) => `
      <tr>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;">${t.idx}</td>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;">${t.type}</td>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;text-align:right;">$${fmtCLP(
          t.price
        )}</td>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;font-family:ui-monospace,Menlo,Consolas,monospace;">${
          t.code
        }</td>
      </tr>
    `
        )
        .join("")
    : `<tr><td colspan="4" style="padding:12px;border:1px solid #e5e7eb;text-align:center;color:#6b7280;">No hay entradas desglosadas</td></tr>`;

  // ⚠️ Sin emojis: todo texto plano para máxima compatibilidad
  return `
<!doctype html>
<html lang="es">
  <head>
    <meta charSet="utf-8"/>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Entradas — ${event?.name || "Evento"}</title>
  </head>
  <body style="margin:0;padding:24px;background:#f5f7fb;color:#111827;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 26px rgba(17,24,39,.08);">
      <tr>
        <td style="padding:20px 24px;background:#111827;color:#fff;">
          <div style="font-weight:700;font-size:18px;">TicketNow</div>
          <div style="font-size:12px;opacity:.9;">${new Date().toLocaleDateString(
            "es-CL"
          )}</div>
        </td>
      </tr>

      ${
        event?.image
          ? `
      <tr><td>
        <img src="${event.image}" alt="${
              event?.name || "Evento"
            }" style="display:block;width:100%;max-height:260px;object-fit:cover;">
      </td></tr>`
          : ""
      }

      <tr><td style="padding:24px 24px 8px 24px;">
        <h1 style="margin:0 0 10px 0;font-size:22px;color:#111827;">Gracias por tu compra${buyerName}</h1>
        <p style="margin:0;color:#374151;">Aquí tienes el resumen de tu orden y el detalle de cada entrada. Presenta este correo el día del evento.</p>
      </td></tr>

      <tr><td style="padding:16px 24px 0 24px;">
        <table role="presentation" width="100%" style="border:1px solid #e5e7eb;border-radius:12px;">
          <tr><td style="padding:14px 16px;">
            <div style="font-weight:600;font-size:16px;color:#111827;">${
              event?.name || "Evento"
            }</div>
            <div style="font-size:14px;color:#374151;">Fecha: ${eventDate}</div>
            <div style="font-size:14px;color:#374151;">Lugar: ${
              event?.location || "Por confirmar"
            }</div>
            ${
              event?.category
                ? `<div style="font-size:13px;color:#6b7280;margin-top:6px;">Categoría: ${event.category}</div>`
                : ""
            }
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="padding:18px 24px 0 24px;">
        <h2 style="margin:0 0 8px 0;font-size:16px;color:#111827;">Resumen de la compra</h2>
        <table role="presentation" width="100%" style="border-collapse:collapse;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="text-align:left;padding:10px 12px;border:1px solid #e5e7eb;">Tipo</th>
              <th style="text-align:center;padding:10px 12px;border:1px solid #e5e7eb;">Cantidad</th>
              <th style="text-align:right;padding:10px 12px;border:1px solid #e5e7eb;">Precio unit.</th>
              <th style="text-align:right;padding:10px 12px;border:1px solid #e5e7eb;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
            <tr>
              <td colspan="3" style="padding:12px;border:1px solid #e5e7eb;text-align:right;font-weight:700;">Total</td>
              <td style="padding:12px;border:1px solid #e5e7eb;text-align:right;font-weight:700;">$${fmtCLP(
                total
              )} CLP</td>
            </tr>
          </tbody>
        </table>
      </td></tr>

      <tr><td style="padding:18px 24px 24px 24px;">
        <h2 style="margin:0 0 8px 0;font-size:16px;color:#111827;">Detalle por entrada</h2>
        <table role="presentation" width="100%" style="border-collapse:collapse;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="text-align:left;padding:10px 12px;border:1px solid #e5e7eb;">#</th>
              <th style="text-align:left;padding:10px 12px;border:1px solid #e5e7eb;">Tipo</th>
              <th style="text-align:right;padding:10px 12px;border:1px solid #e5e7eb;">Precio</th>
              <th style="text-align:left;padding:10px 12px;border:1px solid #e5e7eb;">Código</th>
            </tr>
          </thead>
          <tbody>
            ${ticketRows}
          </tbody>
        </table>

        <div style="margin-top:14px;padding:12px 14px;border:1px dashed #d1d5db;border-radius:10px;color:#374151;font-size:13px;background:#f9fafb;">
          Si necesitas ayuda con tu compra, responde a este correo y te asistiremos.
        </div>

        <p style="color:#6b7280;font-size:12px;margin:16px 0 0 0;">TicketNow © ${new Date().getFullYear()}</p>
      </td></tr>
    </table>
  </body>
</html>
`;
}
