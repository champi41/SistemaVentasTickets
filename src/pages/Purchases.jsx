// src/pages/Purchases.jsx
import { useEffect, useState } from "react";
import { getPurchase } from "../api/purchases";

export default function Purchases() {
  const [ids, setIds] = useState([]);
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar IDs guardados en localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("purchase_ids") || "[]");
    setIds(saved);
  }, []);

  // Obtener detalles de cada compra
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const lista = [];

        for (const id of ids) {
          try {
            const compra = await getPurchase(id);
            lista.push(compra);
          } catch (e) {
            console.error("Error al obtener compra:", e);
          }
        }
        setCompras(lista);
      } finally {
        setLoading(false);
      }
    })();
  }, [ids]);

  if (loading) return <p style={{ padding: "1rem" }}>Cargando historial…</p>;

  return (
    <section className="eventos">
      <h2 style={{ color: "var(--m700)", marginBottom: "1rem" }}>
         Historial de compras
      </h2>

      {!compras.length ? (
        <p>No tienes compras registradas aún.</p>
      ) : (
        <div className="lista">
          {compras.map((p) => (
            <article key={p._id} className="evento">
              <h3>Compra #{p._id?.slice(-6) || "??"}</h3>

              <p>
                <strong>Total:</strong>{" "}
                {Number(p.total_price).toLocaleString("es-CL")}
              </p>

              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(p.confirmed_at).toLocaleString("es-CL")}
              </p>

              <h4 style={{ marginTop: "0.7rem", color: "var(--m700)" }}>
                Entradas:
              </h4>

              <ul style={{ marginLeft: "1.3rem" }}>
                {p.tickets?.map((t) => (
                  <li key={t.code}>
                     {t.type} — <strong>Código:</strong> {t.code}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
