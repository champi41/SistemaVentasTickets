import { useEffect, useState } from "react";
import Eventos from "./components/Eventos";
import { getEvents } from "./api/api"; 

function App() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarEventos() {
      try {
        const data = await getEvents();
        console.log("Respuesta completa de la API:", data);

        if (Array.isArray(data)) {
          setEventos(data);
        } else if (Array.isArray(data.events)) {
          setEventos(data.events);
        } else if (Array.isArray(data.data)) {
          setEventos(data.data);
        } else {
          console.warn("⚠️ No se encontró lista de eventos en la respuesta.");
          setEventos([]);
        }

      } catch (err) {
        console.error("❌ Error al obtener eventos:", err);
        setError("No se pudieron cargar los eventos 😢");
      } finally {
        setLoading(false);
      }
    }

    cargarEventos();
  }, []);

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <header>
        <h1>🎫 TicketNow</h1>
      </header>
      <Eventos eventos={eventos} />
    </>
  );
}

export default App;
