// src/components/RandomEventButton.jsx
import { useNavigate } from "react-router-dom"; // 👈 IMPORTANTE

export default function RandomEventButton({
  validEventIds = [],
  className = "",
}) {
  const navigate = useNavigate();

  const handleRandomNavigation = () => {
    if (!validEventIds.length) {
      alert("No hay eventos cargados para elegir.");
      return;
    }

    const randomIndex = Math.floor(Math.random() * validEventIds.length);
    const randomEventId = validEventIds[randomIndex];

    navigate(`/events/${randomEventId}`);
  };

  return (
    <button
      onClick={handleRandomNavigation}
      className={className || "nav-btn-accent"} // usa tu estilo morado
    >
      ¡Evento Sorpresa!
    </button>
  );
}
