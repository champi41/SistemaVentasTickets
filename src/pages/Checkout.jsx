// src/pages/Checkout.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReservation } from "../api/reservations";
import { checkout } from "../api/checkout";
import { getEvent } from "../api/events";
import { sendTicketEmail } from "../api/sendEmail";
import "../styles/checkout.css";

// ---- helpers comunes ----
function formatCLP(n) {
  const num = Number(n || 0);
  return num.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
}

function formatDateTime(str) {
  if (!str) return "Por definir";
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return "Por definir";
  return d.toLocaleString("es-CL", {
    dateStyle: "full",
    timeStyle: "short",
  });
}

// Construye el detalle de ítems usando preferentemente la compra,
// y si viene vacío, usa la reserva + precios del evento.
function buildItemsForDisplay(resv, event, purchase) {
  const purchaseItems = Array.isArray(purchase?.items) ? purchase.items : [];
  if (purchaseItems.length) {
    return purchaseItems.map((it) => {
      const qty = Number(it.quantity || 0);
      const unit =
        it.price != null
          ? Number(it.price)
          : it.unit_price != null
          ? Number(it.unit_price)
          : 0;
      const subtotal =
        it.subtotal != null ? Number(it.subtotal) : unit * qty;

      return {
        type: it.type,
        quantity: qty,
        price: unit,
        subtotal,
      };
    });
  }

  const resvItems = Array.isArray(resv?.items) ? resv.items : [];
  if (!resvItems.length) return [];

  const priceByType = new Map();
  (event?.tickets || []).forEach((t) => {
    priceByType.set(t.type, Number(t.price || 0));
  });

  return resvItems.map((it) => {
    const qty = Number(it.quantity || 0);
    const unit = priceByType.get(it.type) ?? 0;
    return {
      type: it.type,
      quantity: qty,
      price: unit,
      subtotal: unit * qty,
    };
  });
}

// ---- plantilla de correo HTML ----
function renderTicketEmail({ purchase, event, toName }) {
  const createdAt = purchase?.created_at || new Date().toISOString();
  const created = new Date(createdAt);
  const createdStr = created.toLocaleDateString("es-CL");
  const buyerName = toName || "cliente";

  const eventName = event?.name || "Tus entradas";
  const eventDate = formatDateTime(event?.date);
  const eventLocation = event?.location || "Por definir";
  const eventCategory = event?.category || "General";

  const total =
    purchase?.total_price != null
      ? Number(purchase.total_price)
      : purchase?.total != null
      ? Number(purchase.total)
      : 0;

  const items = Array.isArray(purchase?.items) ? purchase.items : [];

  const heroUrl =
    event?.image && /^https?:\/\//.test(event.image)
      ? event.image
      : "https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&w=1200";

  const rows =
    items.length > 0
      ? items
          .map(
            (it) => `
            <tr>
              <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${
                it.type || "-"
              }</td>
              <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${
                it.quantity ?? 0
              }</td>
              <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatCLP(
                it.price ?? 0
              )}</td>
              <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatCLP(
                it.subtotal ?? (it.price ?? 0) * (it.quantity ?? 0)
              )}</td>
            </tr>`
          )
          .join("")
      : `
        <tr>
          <td colspan="4" style="padding:10px 12px;text-align:center;color:#6b7280;">
            Sin detalle de ítems
          </td>
        </tr>
      `;

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>TicketNow – Confirmación de compra</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:12px 12px 0 0;color:#fff;">
            <tr>
              <td style="padding:18px 24px;font-size:20px;font-weight:600;">
                TicketNow
              </td>
              <td style="padding:18px 24px;font-size:12px;text-align:right;">
                ${createdStr}
              </td>
            </tr>
          </table>

          <table width="600" cellpadding="0" cellspacing="0" style="background:#000;overflow:hidden;">
            <tr>
              <td>
                <img src="${heroUrl}" alt="${eventName}" style="display:block;width:600px;max-width:100%;height:auto;" />
              </td>
            </tr>
          </table>

          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:0 0 12px 12px;padding:24px;">
            <tr>
              <td style="font-size:22px;font-weight:700;padding-bottom:8px;">
                Gracias por tu compra, ${buyerName}!
              </td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#4b5563;padding-bottom:18px;">
                Aquí tienes el resumen de tu orden y el detalle de cada entrada. Presenta este correo el día del evento.
              </td>
            </tr>

            <tr>
              <td style="padding:16px 18px;border-radius:12px;border:1px solid #e5e7eb;background:#f9fafb;">
                <div style="font-size:16px;font-weight:600;margin-bottom:4px;">${eventName}</div>
                <div style="font-size:13px;color:#4b5563;margin-bottom:2px;">Fecha: ${eventDate}</div>
                <div style="font-size:13px;color:#4b5563;margin-bottom:2px;">Lugar: ${eventLocation}</div>
                <div style="font-size:13px;color:#6b7280;">Categoría: ${eventCategory}</div>
              </td>
            </tr>

            <tr>
              <td style="padding-top:24px;font-size:16px;font-weight:600;">
                Resumen de la compra
              </td>
            </tr>

            <tr>
              <td style="padding-top:8px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px;">
                  <thead>
                    <tr>
                      <th align="left" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;background:#f9fafb;">Tipo</th>
                      <th align="center" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;background:#f9fafb;">Cantidad</th>
                      <th align="right" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;background:#f9fafb;">Precio unit.</th>
                      <th align="right" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;background:#f9fafb;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rows}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3" style="padding:10px 12px;text-align:right;font-weight:600;border-top:1px solid #e5e7eb;">
                        Total
                      </td>
                      <td style="padding:10px 12px;text-align:right;font-weight:700;border-top:1px solid #e5e7eb;">
                        ${formatCLP(total)} CLP
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding-top:24px;font-size:12px;color:#6b7280;line-height:1.5;">
                Si no reconoces esta compra o necesitas ayuda, responde a este correo y nuestro equipo te asistirá.
              </td>
            </tr>

            <tr>
              <td style="padding-top:18px;font-size:11px;color:#9ca3af;text-align:center;">
                TicketNow © 2025 — Gracias por tu compra.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// ---- componente principal ----
export default function Checkout() {
  const { reservation_id } = useParams();
  const nav = useNavigate();

  const [resv, setResv] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [buyer, setBuyer] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  const [now, setNow] = useState(() => new Date());

  // reloj para countdown
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // cargar reserva + evento
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await getReservation(reservation_id);
        setResv(r);
        setErr(null);

        if (r?.event_id) {
          try {
            const ev = await getEvent(r.event_id);
            setEvent(ev);
          } catch (e) {
            console.error("Error al obtener evento:", e);
          }
        }
      } catch (e) {
        console.error(e);
        setErr(e.message || "No se pudo cargar la reserva");
      } finally {
        setLoading(false);
      }
    })();
  }, [reservation_id]);

  const expiresAt = useMemo(
    () => (resv?.expires_at ? new Date(resv.expires_at) : null),
    [resv]
  );
  const expired = expiresAt ? now > expiresAt : false;

  const displayItems = useMemo(
    () => buildItemsForDisplay(resv, event, null),
    [resv, event]
  );

  const totalDisplay =
    resv?.total_price != null
      ? Number(resv.total_price)
      : displayItems.reduce((acc, it) => acc + (it.subtotal || 0), 0);

  const canSubmit =
    !expired &&
    !submitting &&
    buyer.name.trim().length > 1 &&
    buyer.email.trim().length > 5;

  const onChangeBuyer = (field, value) => {
    setBuyer((prev) => ({ ...prev, [field]: value }));
  };

  const confirmar = async () => {
    if (!canSubmit) return;
    try {
      setSubmitting(true);

      // 1) confirmar compra en API
      const purchase = await checkout({ reservation_id, buyer });

      // 1.1) guardar id de la compra en localStorage para historial
      try {
        const KEY = "purchase_ids";
        const prev = JSON.parse(localStorage.getItem(KEY) || "[]");
        const id = purchase._id || purchase.id;
        if (id && !prev.includes(id)) {
          localStorage.setItem(KEY, JSON.stringify([...prev, id]));
        }
      } catch (e) {
        console.error("No se pudo guardar el historial en localStorage", e);
      }

      // 2) asegurar evento
      let ev = event;
      if (!ev && resv?.event_id) {
        ev = await getEvent(resv.event_id);
      }

      // 3) construir ítems para el correo
      const emailItems = buildItemsForDisplay(resv, ev, purchase);

      // 4) generar HTML del correo
      const html = renderTicketEmail({
        purchase: { ...purchase, items: emailItems },
        event: ev,
        toName: buyer.name,
      });

      // 5) enviar correo
      await sendTicketEmail({
        to: buyer.email,
        subject: `Tus entradas: ${ev?.name || "TicketNow"}`,
        html,
      });

      alert("Compra confirmada 🎉 Te enviamos las entradas por email.");
      nav("/");
    } catch (e) {
      console.error(e);
      alert(e.message || "No se pudo confirmar la compra");
    } finally {
      setSubmitting(false);
    }
  };

  // ---- render ----
  if (loading) {
    return (
      <main className="co">
        <p className="co-loading">Cargando reserva…</p>
      </main>
    );
  }

  if (err) {
    return (
      <main className="co">
        <p className="co-error">{err}</p>
      </main>
    );
  }

  if (!resv) {
    return (
      <main className="co">
        <p className="co-error">Reserva no encontrada.</p>
      </main>
    );
  }

  const status = resv.status || "PENDING";
  let statusLabel = status;
  if (status === "PENDING") statusLabel = "Pendiente";
  if (status === "CONFIRMED") statusLabel = "Confirmada";

  const countdown =
    expiresAt && !expired
      ? Math.max(0, Math.floor((expiresAt - now) / 1000))
      : 0;

  const minutesLeft = Math.floor(countdown / 60);
  const secondsLeft = countdown % 60;

  return (
    <main className="co">
      <h2 className="co-title">Confirmar compra</h2>

      <div className="co-grid">
        {/* Columna izquierda: resumen */}
        <section className="co-left">
          <div className="co-resume">
            <div className="co-row">
              <span className="co-label">Reserva:</span>
              <span className="co-value mono">{reservation_id}</span>
            </div>
            <div className="co-row">
              <span className="co-label">Total:</span>
              <span className="co-value">{formatCLP(totalDisplay)}</span>
            </div>
            <div className="co-row">
              <span className="co-label">Estado:</span>
              <span className="co-value">
                <span
                  className={
                    "co-badge " +
                    (expired
                      ? "expired"
                      : status === "CONFIRMED"
                      ? "confirmed"
                      : "pending")
                  }
                >
                  {expired ? "Expirada" : statusLabel}
                </span>
              </span>
            </div>
            {expiresAt && !expired && (
              <div className="co-row">
                <span className="co-label">Reserva válida por:</span>
                <span className="co-value">
                  <span className="co-countdown">
                    {minutesLeft.toString().padStart(2, "0")}:
                    {secondsLeft.toString().padStart(2, "0")} min
                  </span>
                </span>
              </div>
            )}
          </div>

          {event && (
            <>
              <h3 className="co-subtitle">Evento</h3>
              <div className="co-items">
                <div className="co-item">
                  <div className="co-item-type">
                    <strong>{event.name}</strong>
                    <small>
                      {formatDateTime(event.date)} — {event.location}
                    </small>
                  </div>
                </div>
              </div>
            </>
          )}

          <h3 className="co-subtitle">Entradas</h3>
          <div className="co-items">
            {displayItems.length ? (
              displayItems.map((it) => (
                <div key={it.type} className="co-item">
                  <div className="co-item-type">
                    <strong>{it.type}</strong>
                    <small>Cantidad: {it.quantity}</small>
                  </div>
                  <div className="co-item-price">
                    {formatCLP(it.subtotal || 0)}
                  </div>
                </div>
              ))
            ) : (
              <p className="co-empty">Sin detalle de entradas.</p>
            )}
          </div>

          <div className="co-total">
            <span>Total</span>
            <span>{formatCLP(totalDisplay)}</span>
          </div>
        </section>

        {/* Columna derecha: formulario comprador */}
        <section className="co-right">
          <div className="co-card">
            <h3>Datos del comprador</h3>
            <div className="co-field">
              <label htmlFor="buyer-name">Nombre completo</label>
              <input
                id="buyer-name"
                type="text"
                placeholder="Ej: Felipe Delgado"
                value={buyer.name}
                onChange={(e) => onChangeBuyer("name", e.target.value)}
              />
            </div>
            <div className="co-field">
              <label htmlFor="buyer-email">Correo electrónico</label>
              <input
                id="buyer-email"
                type="email"
                placeholder="tucorreo@ejemplo.cl"
                value={buyer.email}
                onChange={(e) => onChangeBuyer("email", e.target.value)}
              />
            </div>
            <button
              className="co-btn"
              disabled={!canSubmit}
              onClick={confirmar}
            >
              {submitting ? "Confirmando..." : "Confirmar compra"}
            </button>
            {expired && (
              <p className="co-hint">
                La reserva está expirada. Vuelve al listado de eventos y genera
                una nueva.
              </p>
            )}
          </div>

          <div className="co-note">
            <strong>Nota:</strong> Usaremos este correo solo para enviarte el
            comprobante y las entradas. Revisa también tu carpeta de spam si no
            lo encuentras.
          </div>
        </section>
      </div>
    </main>
  );
}
