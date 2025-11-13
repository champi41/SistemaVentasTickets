import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { listEvents } from "../api/events";

// 1. Recibir la prop setEventIds y darle un valor por defecto seguro
export default function Home({ setEventIds = () => {} }) { 
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // PAGINACIÓN
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8; // ← 8 eventos por página

  const nav = useNavigate();

  //   Cargar eventos desde API

  async function cargar(qstr = "") {
    try {
      const data = await listEvents(qstr);

      const items = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

      setEventos(items);

      // 2. EXTRAER y ENVIAR los ObjectIds a App.jsx
      const ids = items.map(ev => ev._id);
      setEventIds(ids); 

    } catch (e) {
      setError(e.message || "Error al cargar eventos");
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  }

  // cargar al inicio
  useEffect(() => {
    cargar();
  }, []);

  // búsqueda con debounce
  useEffect(() => {
    if (q === "") {
      cargar();
      setPage(1);
      return;
    }

    setIsTyping(true);

    const delay = setTimeout(() => {
      cargar(q);
      setPage(1);
    }, 600);

    return () => clearTimeout(delay);
  }, [q]);

  // ===========================
  //   PAGINACIÓN FRONTEND
  // ===========================

  const totalPages = Math.max(1, Math.ceil(eventos.length / PAGE_SIZE));

  const eventosPagina = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return eventos.slice(start, start + PAGE_SIZE);
  }, [eventos, page]);

  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  // ===========================
  //   RENDER
  // ===========================
  return (
    <section className="eventos">
      {/* BUSCADOR */}
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

      {/* LISTADO DE EVENTOS */}
      {loading && !isTyping ? (
        <p>Cargando eventos...</p>
      ) : (
        <>
          <div className="lista">
            {eventosPagina.length ? (
              eventosPagina.map((ev) => (
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
            ) : (
              !loading && <p>No hay eventos disponibles</p>
            )}
          </div>

          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <div className="paginacion">
              {/* ANTERIOR */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ‹ Anterior
              </button>

              {/* PÁGINAS */}
              {Array.from({ length: totalPages }, (_, i) => {
                const num = i + 1;
                return (
                  <button
                    key={num}
                    className={num === page ? "activa" : ""}
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </button>
                );
              })}

              {/* SIGUIENTE */}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Siguiente ›
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
