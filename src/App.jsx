import { useEffect, useState } from "react";
import Eventos from "./components/Eventos";
import CrearEvento from "./components/CrearEvento";
import { getEvents } from "./api/api";

function App() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false); // 👈 NUEVO

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

  useEffect(() => {
    cargarEventos();
  }, []);

  const manejarBusqueda = (e) => {
    e.preventDefault();
    cargarEventos(busqueda);
  };

  const cerrarModal = () => setMostrarModal(false);

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <header style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h1>🎫 TicketNow</h1>

        <form onSubmit={manejarBusqueda}>
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

        {/* 👇 BOTÓN PARA MOSTRAR MODAL */}
        <button onClick={() => setMostrarModal(true)}>+ Crear Evento</button>
      </header>

      <Eventos eventos={eventos} />

      {/* 👇 MODAL */}
      {mostrarModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button onClick={cerrarModal} style={styles.cerrar}>✖</button>
            <CrearEvento onEventoCreado={() => { cerrarModal(); cargarEventos(); }} />
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    width: "400px",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
  },
  cerrar: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
};

export default App;
