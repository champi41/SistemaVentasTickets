import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listEvents } from "../api/events";

export default function Home() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const nav = useNavigate();

  async function cargar(qstr = "") {
    try {
      const data = await listEvents(qstr);
      const items = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      setEventos(items);
    } catch (e) {
      setError(e.message || "Error al cargar eventos");
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  useEffect(() => {
    if (q === "") {
      cargar();
      return;
    }
    setIsTyping(true);
    const delay = setTimeout(() => {
      cargar(q);
    }, 600);
    return () => clearTimeout(delay);
  }, [q]);

  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <section className="eventos">
      <div className="busqueda">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setLoading(true);
          }}
          placeholder="Buscar evento..."
        />
      </div>

      {loading && !isTyping ? (
        <p>Cargando eventos...</p>
      ) : (
        <div className="lista">
          {eventos.length
            ? eventos.map((ev) => (
                <article
                  key={ev._id}
                  className="evento"
                  onClick={() => nav(`/events/${ev._id}`)}
                >
                  <div className="evento-imagen">
                    <img src={ev.image} alt={ev.name} />
                  </div>
                  <div className="evento-info">
                    <h3>{ev.name}</h3>
                    <p>
                      <strong>Categoría:</strong> {ev.category}
                    </p>
                    <p>
                      <strong>Lugar:</strong> {ev.location}
                    </p>
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {new Date(ev.date).toLocaleString("es-CL", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </article>
              ))
            : !loading && <p>No hay eventos disponibles</p>}
        </div>
      )}
    </section>
  );
}
