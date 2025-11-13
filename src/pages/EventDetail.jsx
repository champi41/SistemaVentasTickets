import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEvent } from "../api/events.js";
import { createReservation } from "../api/reservations";
import "../styles/event-detail.css"; // ← CSS del detalle separado

export default function EventDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const [ev, setEv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [qtyByType, setQtyByType] = useState({});

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getEvent(id);
        setEv(data);
        const init = {};
        (data?.tickets || []).forEach((t) => (init[t.type] = 0));
        setQtyByType(init);
      } catch (e) {
        setErr(e.message || "Error al cargar evento");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const totalCLP = useMemo(() => {
    if (!ev?.tickets) return 0;
    return ev.tickets.reduce(
      (acc, t) => acc + (qtyByType[t.type] || 0) * (t.price || 0),
      0
    );
  }, [qtyByType, ev]);

  const totalItems = useMemo(
    () => Object.values(qtyByType).reduce((a, b) => a + (b || 0), 0),
    [qtyByType]
  );

  const setQty = (type, next) => {
    const ticket = ev.tickets.find((t) => t.type === type);
    const max = Math.min(110, ticket?.available ?? 0);
    const val = Math.max(0, Math.min(max, Number.isFinite(next) ? next : 0));
    setQtyByType((prev) => ({ ...prev, [type]: val }));
  };

  const inc = (type) => setQty(type, (qtyByType[type] || 0) + 1);
  const dec = (type) => setQty(type, (qtyByType[type] || 0) - 1);

  const reservar = async () => {
    if (!ev?.tickets?.length) return;
    const items = Object.entries(qtyByType)
      .filter(([, q]) => q > 0)
      .map(([type, quantity]) => ({ type, quantity }));

    if (items.length === 0) {
      alert("Selecciona al menos 1 entrada.");
      return;
    }

    try {
      const res = await createReservation({
        event_id: ev._id,
        items,
      });
      nav(`/checkout/${res.reservation_id}`);
    } catch (e) {
      alert(e.message || "No se pudo crear la reserva");
    }
  };

  if (loading) return <p className="ed-loading">Cargando evento…</p>;
  if (err) return <p className="ed-error">{err}</p>;
  if (!ev) return <p className="ed-error">Evento no encontrado</p>;

  return (
    <section className="ed">
      <div className="ed-grid">
        {/* IZQUIERDA: info + selección */}
        <aside className="ed-left">
          <h1 className="ed-title">{ev.name}</h1>
          <p className="ed-line">{new Date(ev.date).toLocaleString("es-CL", { dateStyle: "full", timeStyle: "short" })}</p>
          <p className="ed-line">{ev.location}</p>
          <p className="ed-line"><strong>Categoría:</strong> {ev.category}</p>

          <h2 className="ed-subtitle">Selecciona tus entradas</h2>

          <div className="ed-ticket-list">
            {ev.tickets?.map((t) => {
              const max = Math.min(110, t.available ?? 0);
              const q = qtyByType[t.type] || 0;
              return (
                <div key={t.type} className="ed-ticket-row">
                  <div className="ed-ticket-meta">
                    <h3 className="ed-ticket-name">{t.type}</h3>
                    <p className="ed-ticket-price">${t.price.toLocaleString("es-CL")} CLP</p>
                    <small className="ed-ticket-stock">Disponibles: {t.available} (máx. {max})</small>
                  </div>
                  <div className="ed-qty">
                    <button className="ed-qty-btn" onClick={() => dec(t.type)} disabled={q <= 0}>−</button>
                    <input
                      className="ed-qty-input"
                      type="number"
                      min={0}
                      max={max}
                      value={q}
                      onChange={(e) => setQty(t.type, parseInt(e.target.value || "0", 10))}
                    />
                    <button className="ed-qty-btn" onClick={() => inc(t.type)} disabled={q >= max}>+</button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="ed-summary">
            <div><strong>Entradas:</strong> {totalItems}</div>
            <div><strong>Total:</strong> ${totalCLP.toLocaleString("es-CL")} CLP</div>
          </div>

          <button className="ed-reserve" onClick={reservar} disabled={totalItems === 0}>
            Reservar entradas
          </button>
        </aside>

        {/* DERECHA: imagen grande arriba + mapa abajo */}
        <div className="ed-right">
          <div className="ed-poster">
            <img src={ev.image} alt={ev.name} />
          </div>

          <div className="ed-map">
            <iframe
              title="Mapa ubicación"
              src={`https://www.google.com/maps?q=${encodeURIComponent(ev.location)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
