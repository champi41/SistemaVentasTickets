import { useEffect, useState } from "react";
import Eventos from "./components/Eventos";
import { getEvents } from "./api/api";

function App() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // 🟢 Función para obtener eventos (puede incluir búsqueda)
  async function cargarEventos(query = "") {
    try {
      setLoading(true);
      const data = await getEvents(query);
      console.log("Respuesta de la API:", data);

      if (Array.isArray(data.data)) {
        setEventos(data.data);
      } else if (Array.isArray(data.events)) {
        setEventos(data.events);
      } else {
        setEventos(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("❌ Error al obtener eventos:", err);
      setError("No se pudieron cargar los eventos 😢");
    } finally {
      setLoading(false);
    }
  }

  // 🟡 Cargar eventos al inicio
  useEffect(() => {
    cargarEventos();
  }, []);

  // 🔍 Buscar eventos por texto
  const manejarBusqueda = (e) => {
    e.preventDefault();
    cargarEventos(busqueda);
  };

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <header>
        <h1>🎫 TicketNow</h1>

        {/* 🔍 Barra de búsqueda */}
        <form onSubmit={manejarBusqueda} style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Buscar evento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              width: "250px",
              marginRight: "10px",
            }}
          />
          <button type="submit">Buscar</button>
        </form>
      </header>

      {/* 🎟️ Lista de eventos */}
      <Eventos eventos={eventos} />
    </>
  );
}

export default App;
