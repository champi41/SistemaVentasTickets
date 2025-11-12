import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReservation } from "../api/reservations";
import { checkout } from "../api/checkout";
import "../styles/checkout.css"; // ← CSS separado para checkout

export default function Checkout() {
  const { reservation_id } = useParams();
  const nav = useNavigate();

  const [resv, setResv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [buyer, setBuyer] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Cargar reserva
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getReservation(reservation_id);
        setResv(data);
      } catch (e) {
        setErr(e.message || "Reserva no encontrada o expirada");
      } finally {
        setLoading(false);
      }
    })();
  }, [reservation_id]);

  // Ticker para la cuenta regresiva
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const expiresAt = useMemo(
    () => (resv?.expires_at ? new Date(resv.expires_at).getTime() : null),
    [resv]
  );
  const msLeft = useMemo(
    () => (expiresAt ? Math.max(0, expiresAt - now) : 0),
    [expiresAt, now]
  );
  const expired = expiresAt ? msLeft <= 0 : false;

  function fmtTime(ms) {
    const s = Math.floor(ms / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  const canSubmit =
    !expired &&
    resv?.status === "PENDING" &&
    buyer.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email);

  const confirmar = async () => {
    if (!canSubmit) return;
    try {
      setSubmitting(true);
      const purchase = await checkout({ reservation_id, buyer });
      // Podrías redirigir a una pantalla de éxito o al home
      alert("Compra confirmada 🎉");
      nav(`/`); // vuelve a inicio
    } catch (e) {
      alert(e.message || "No se pudo confirmar la compra");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <section className="co"><p className="co-loading">Cargando…</p></section>;
  if (err) return <section className="co"><p className="co-error">{err}</p></section>;
  if (!resv) return <section className="co"><p className="co-error">Reserva no disponible</p></section>;

  return (
    <section className="co">
      <div className="co-grid">
        {/* Columna izquierda: resumen de la reserva */}
        <div className="co-left">
          <h1 className="co-title">Confirmación de compra</h1>

          <div className="co-resume">
            <div className="co-row">
              <span className="co-label">Reserva</span>
              <span className="co-value mono">{reservation_id}</span>
            </div>
            <div className="co-row">
              <span className="co-label">Estado</span>
              <span className={`co-badge ${resv.status?.toLowerCase()}`}>
                {expired ? "EXPIRED" : resv.status}
              </span>
            </div>
            <div className="co-row">
              <span className="co-label">Expira en</span>
              <span className={`co-countdown ${expired ? "expired" : ""}`}>
                {expiresAt ? (expired ? "00:00" : fmtTime(msLeft)) : "—"}
              </span>
            </div>
          </div>

          <h2 className="co-subtitle">Entradas seleccionadas</h2>
          <div className="co-items">
            {resv.items?.length ? (
              resv.items.map((it, i) => (
                <div key={i} className="co-item">
                  <div className="co-item-type">
                    <strong>{it.type}</strong>
                    <small>Cantidad: {it.quantity}</small>
                  </div>
                  {typeof it.price === "number" && (
                    <div className="co-item-price">
                      ${(it.price * it.quantity).toLocaleString("es-CL")} CLP
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="co-empty">Sin items en la reserva</p>
            )}
          </div>

          <div className="co-total">
            <span>Total</span>
            <strong>${(resv.total_price ?? 0).toLocaleString("es-CL")} CLP</strong>
          </div>
        </div>

        {/* Columna derecha: datos del comprador y pago */}
        <div className="co-right">
          <div className="co-card">
            <h3>Datos del comprador</h3>

            <div className="co-field">
              <label>Nombre</label>
              <input
                value={buyer.name}
                onChange={(e) => setBuyer((v) => ({ ...v, name: e.target.value }))}
                placeholder="Tu nombre completo"
                disabled={expired || resv.status !== "PENDING" || submitting}
              />
            </div>

            <div className="co-field">
              <label>Email</label>
              <input
                value={buyer.email}
                onChange={(e) => setBuyer((v) => ({ ...v, email: e.target.value }))}
                placeholder="tu@email.com"
                disabled={expired || resv.status !== "PENDING" || submitting}
              />
              <small className="co-help">
                Se enviará un comprobante a este correo.
              </small>
            </div>

            <button
              className="co-btn"
              onClick={confirmar}
              disabled={!canSubmit || submitting}
            >
              {submitting ? "Confirmando..." : "Confirmar compra"}
            </button>

            {expired && (
              <p className="co-hint">
                La reserva expiró. Vuelve al evento y crea una nueva.
              </p>
            )}
            {resv.status !== "PENDING" && !expired && (
              <p className="co-hint">
                Esta reserva ya no está activa ({resv.status}).
              </p>
            )}
          </div>

          {/* Datos legales/ayuda opcional */}
          <div className="co-note">
            <small>
              Al confirmar, aceptas los términos y condiciones. No se admiten cambios ni devoluciones
              salvo eventos cancelados o reprogramados por el organizador.
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}
