// src/pages/Purchases.jsx
import { useEffect, useState } from "react";
import { getPurchase } from "../api/purchases";

export default function Purchases() {
  const [ids, setIds] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = "purchase_ids";
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    setIds(saved);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const out = [];
        for (const id of ids) {
          try {
            const p = await getPurchase(id); // ← usa la función nombrada
            out.push(p);
          } catch {}
        }
        setItems(out);
      } finally {
        setLoading(false);
      }
    })();
  }, [ids]);

  if (loading) return <p>Cargando historial…</p>;
  return (
    <section>
      <h2>Historial de compras</h2>
      {!items.length ? <p>Sin compras aún.</p> : (
        <div className="lista">
          {items.map(p => (
            <article key={p._id} className="evento">
              <h3>Compra #{p._id.slice(-6)}</h3>
              <p><strong>Total:</strong> ${p.total_price?.toLocaleString()}</p>
              <p><strong>Confirmada:</strong> {new Date(p.confirmed_at).toLocaleString("es-CL")}</p>
              <h4>Tickets</h4>
              <ul>
                {p.tickets?.map(t => (
                  <li key={t.code}>{t.type} — Código: {t.code}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
