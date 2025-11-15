// src/components/RandomEventButton.jsx
import { useNavigate } from "react-router-dom";

export default function RandomEventButton({ validEventIds = [], className = "" }) {
  const navigate = useNavigate();

  const handleRandomNavigation = () => {
    if (validEventIds.length === 0) {
      alert("No hay eventos cargados para elegir.");
      return;
    }

    // Evento aleatorio
    const randomIndex = Math.floor(Math.random() * validEventIds.length);
    const randomEventId = validEventIds[randomIndex];

    // Descuento aleatorio entre 10% y 25%
    const discount = Math.floor(Math.random() * (25 - 10 + 1)) + 10;

    // Navegar con el descuento en la URL
    navigate(`/events/${randomEventId}?discount=${discount}`);
  };

  return (
    <button onClick={handleRandomNavigation} className={className}>
      🎁 Evento Sorpresa
    </button>
  );
}
