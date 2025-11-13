import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { listEvents } from "../api/events.js";
// Importamos el nuevo componente de sección
import EventosList from "../components/EventosList.jsx";

// 3. COMPONENTE "HOME" ACTUALIZADO (Contenedor)
// Mantiene toda la lógica de estado y carga de datos.
// Su 'return' ahora es mucho más simple.

export default function Home({ setEventIds = () => {} }) {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // PAGINACIÓN
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const nav = useNavigate();

  // Cargar eventos desde API (sin cambios)
  async function cargar(qstr = "") {
    try {
      const data = await listEvents(qstr);

      const items = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

      setEventos(items);
      const ids = items.map((ev) => ev._id);
      setEventIds(ids);
    } catch (e) {
      setError(e.message || "Error al cargar eventos");
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  }

  // cargar al inicio (sin cambios)
  useEffect(() => {
    cargar();
  }, []);

  // búsqueda con debounce (sin cambios)
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

  // PAGINACIÓN FRONTEND (sin cambios)
  const totalPages = Math.max(1, Math.ceil(eventos.length / PAGE_SIZE));

  const eventosPagina = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return eventos.slice(start, start + PAGE_SIZE);
  }, [eventos, page]);

  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  // ===========================
  // RENDER (¡Aquí está el cambio!)
  // ===========================
  return (
    // Renderizamos el componente EventosList y le pasamos todo
    // lo que necesita como props.
    <EventosList
      q={q}
      loading={loading}
      isTyping={isTyping}
      eventosPagina={eventosPagina}
      totalPages={totalPages}
      page={page}
      // Pasamos los manejadores de eventos
      onQueryChange={(newQuery) => {
        setQ(newQuery);
        setLoading(true); // Mantenemos la lógica original del onChange
      }}
      onEventoClick={(id) => nav(`/events/${id}`)}
      onPageChange={setPage} // setPage se puede pasar directamente
    />
  );
}
