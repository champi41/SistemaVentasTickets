// src/pages/Checkout.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getReservation } from "../api/reservations";
import { checkout } from "../api/checkout";
import { getEvent } from "../api/events";

import { sendTicketEmail } from "../api/sendemail";
import { renderTicketEmail } from "../emails/ticketReceipt";

import "../styles/checkout.css";

export default function Checkout() {
  const { reservation_id } = useParams();
  const nav = useNavigate();

  const [resv, setResv] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [buyer, setBuyer] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = buyer.name.trim() && buyer.email.trim();

  // Cargar reserva (y evento)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getReservation(reservation_id);
        setResv(data);
        if (data?.event_id) {
          const ev = await getEvent(data.event_id);
          setEvent(ev);
        }
      } catch (e) {
        setErr(e.message || "Reserva no encontrada o expirada");
      } finally {
        setLoading(false);
      }
    })();
  }, [reservation_id]);

  // ¿Está vencida?
  const exp = useMemo(() => (resv ? new Date(resv.expires_at) : null), [resv]);
  const vencida = useMemo(() => (exp ? exp < new Date() : false), [exp]);

  // priceMap {type -> price} desde el evento
  const priceMap = useMemo(() => {
    const map = {};
    (event?.tickets || []).forEach((t) => {
      const key = String(t?.type ?? "")
        .normalize("NFKC")
        .trim()
        .toLowerCase();
      map[key] = Number(t?.price) || 0;
    });
    return map;
  }, [event]);

  // Ítems con unitPrice/subtotal (fallback a event.tickets si reserva no trae price)
  const items = useMemo(() => {
    const base = Array.isArray(resv?.items) ? resv.items : [];
    return base.map((it) => {
      const type = it?.type ?? "-";
      const qty = Math.max(1, Number(it?.quantity || 1));
      const key = String(type).normalize("NFKC").trim().toLowerCase();
      const unit = it?.price != null ? Number(it.price) : priceMap[key] ?? 0;
      return {
        type,
        quantity: qty,
        unitPrice: unit,
        subtotal: unit * qty,
      };
    });
  }, [resv, priceMap]);

  const totalCalc = useMemo(() => {
    if (!items.length) return Number(resv?.total_price) || 0;
    return items.reduce((acc, it) => acc + it.subtotal, 0);
  }, [items, resv]);

  // Confirmar compra + email
  async function confirmar() {
    if (!canSubmit || vencida) return;
    try {
      setSubmitting(true);

      // 1) Confirmar en API
      const purchase = await checkout({ reservation_id, buyer });

      // 2) Generar HTML del correo (pasamos items de la reserva como fallback)
      const html = renderTicketEmail({
        purchase,
        event: event || {},
        toName: buyer.name,
        reservationItems: resv?.items || [],
      });

      // 3) Enviar correo (Apps Script)
      await sendTicketEmail({
        to: buyer.email,
        subject: `Tus entradas: ${event?.name || "Evento"}`,
        html,
      });

      alert("Compra confirmada. Enviamos tus entradas por correo.");
      nav("/");
    } catch (e) {
      alert(e.message || "No se pudo confirmar la compra");
    } finally {
      setSubmitting(false);
    }
  }

  // Render
  if (loading) return <div className="co co-loading">Cargando…</div>;
  if (err) return <div className="co co-error">{err}</div>;
  if (!resv) return <div className="co co-error">Reserva no disponible</div>;

  return (
    <section className="co">
      <div className="co-grid">
        {/* IZQUIERDA: Resumen */}
        <div className="co-left">
          <h2 className="co-title">Confirmar compra</h2>

          <div className="co-resume">
            <div className="co-row">
              <span className="co-label">Reserva</span>
              <span className="co-value mono">{reservation_id}</span>
            </div>
            <div className="co-row">
              <span className="co-label">Evento</span>
              <span className="co-value">{event?.name || "—"}</span>
            </div>
            <div className="co-row">
              <span className="co-label">Fecha</span>
              <span className="co-value">
                {event?.date
                  ? new Date(event.date).toLocaleString("es-CL", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "—"}
              </span>
            </div>
            <div className="co-row">
              <span className="co-label">Estado</span>
              <span
                className={`co-badge ${
                  vencida
                    ? "expired"
                    : resv.status === "pending"
                    ? "pending"
                    : "confirmed"
                }`}
              >
                {vencida ? "Expirada" : resv.status || "Pendiente"}
              </span>
            </div>
          </div>

          <h3 className="co-subtitle">Entradas</h3>
          <div className="co-items">
            {items.length ? (
              items.map((it, i) => (
                <div className="co-item" key={i}>
                  <div className="co-item-type">
                    <strong>{it.type}</strong>
                    <small>Cantidad: {it.quantity}</small>
                    <small>
                      Precio unit.: ${it.unitPrice.toLocaleString()}
                    </small>
                  </div>
                  <div className="co-item-price">
                    ${Number(it.subtotal).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="co-empty">No hay ítems para mostrar</div>
            )}
          </div>

          <div className="co-total">
            <strong>Total a pagar</strong>
            <strong>
              ${Number(totalCalc || resv.total_price || 0).toLocaleString()}
            </strong>
          </div>

          <p className="co-note" style={{ marginTop: ".9rem" }}>
            Revisa los datos antes de confirmar. Recibirás tus entradas por
            correo.
          </p>
        </div>

        {/* DERECHA: Formulario */}
        <div className="co-right">
          <div className="co-card">
            <div className="co-field">
              <label htmlFor="buyer-name">Nombre completo</label>
              <input
                id="buyer-name"
                type="text"
                placeholder="Ej: Juan Pérez"
                value={buyer.name}
                onChange={(e) =>
                  setBuyer((v) => ({ ...v, name: e.target.value }))
                }
              />
            </div>

            <div className="co-field">
              <label htmlFor="buyer-mail">Correo electrónico</label>
              <input
                id="buyer-mail"
                type="email"
                placeholder="tu@correo.com"
                value={buyer.email}
                onChange={(e) =>
                  setBuyer((v) => ({ ...v, email: e.target.value }))
                }
              />
              <small className="co-help">
                Enviaremos las entradas a este correo.
              </small>
            </div>

            <button
              className="co-btn"
              onClick={confirmar}
              disabled={!canSubmit || submitting || vencida}
            >
              {submitting ? "Procesando…" : "Confirmar compra"}
            </button>

            {vencida && (
              <div className="co-hint">
                La reserva está expirada. Vuelve al evento para crear una nueva.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
