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

        // 🔹 Fuerza expiración a 5 minutos desde ahora
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        r.expires_at = expiresAt.toISOString();

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

      // 1.1) guardar id en historial local
      try {
        const KEY = "purchase_ids";
        const prev = JSON.parse(localStorage.getItem(KEY) || "[]");
        const id = purchase._id || purchase.id;
        if (id && !prev.includes(id)) {
          localStorage.setItem(KEY, JSON.stringify([...prev, id]));
        }
      } catch (e) {
        console.error("No se pudo guardar historial local", e);
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

      alert("Compra confirmada ✅ Te enviamos las entradas por email.");
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
        {/* Columna izquierda */}
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

        {/* Columna derecha */}
        <section className="co-right">
          <div className="co-card">
            <h3>Datos del comprador</h3>
            <div className="co-field">
              <label htmlFor="buyer-name">Nombre completo</label>
              <input
                id="buyer-name"
                type="text"
                placeholder="Ej: Diego Muñoz"
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
            <button className="co-btn" disabled={!canSubmit} onClick={confirmar}>
              {submitting ? "Confirmando..." : "Confirmar compra"}
            </button>
            {expired && (
              <p className="co-hint">
                La reserva expiró. Vuelve al listado de eventos y genera una nueva.
              </p>
            )}
          </div>

          <div className="co-note">
            <strong>Nota:</strong> Usaremos este correo solo para enviarte el comprobante y las entradas. 
            Revisa también tu carpeta de spam si no lo encuentras.
          </div>
        </section>
      </div>
    </main>
  );
}
