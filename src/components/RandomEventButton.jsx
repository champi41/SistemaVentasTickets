// src/components/RandomEventButton.jsx
import { useNavigate } from "react-router-dom";

// 1. Recibir la prop validEventIds y darle un array vacío como valor por defecto
export default function RandomEventButton({ validEventIds = [] }) { 
  const navigate = useNavigate();

  const handleRandomNavigation = () => {
    // Usar la lista de IDs que viene del componente Home
    if (validEventIds.length === 0) {
      alert("No hay eventos cargados para elegir.");
      return;
    }

    // 2. Selecciona un índice aleatorio
    const randomIndex = Math.floor(Math.random() * validEventIds.length);
    
    // 3. Obtiene el ID del evento aleatorio (el ObjectId real)
    const randomEventId = validEventIds[randomIndex];
    
    // 4. Navega a la ruta de detalle del evento
    navigate(`/events/${randomEventId}`);
  };

  return (
    <button 
      onClick={handleRandomNavigation}
      style={{
        backgroundColor: "#f7a43f",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      ¡Evento Sorpresa!
    </button>
  );
}