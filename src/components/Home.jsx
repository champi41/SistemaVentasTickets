import CrearEvento from "./CrearEvento";
import { getEvents } from "../api/api"
import Eventos from "./Eventos";
import { useState, useEffect } from "react";

const Home = () => {

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
    <div className="home">
      <Eventos eventos={eventos} />
      <CrearEvento onEventoCreado={() => cargarEventos()} />
    </div>
  );
}

export default Home