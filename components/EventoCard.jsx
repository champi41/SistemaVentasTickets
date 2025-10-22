import React, { useRef, useState } from "react";

const EventoCard = ({ nombre, tipo1, tipo2, tipo3 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [transform, setTransform] = useState("");
  const cardRef = useRef(null);

  const toggleExpanded = () => {
    if (!isExpanded) {
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();

      // Medidas de pantalla
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Calculamos desplazamiento al centro
      const translateX = screenWidth / 2 - (rect.x + rect.width / 2);
      const translateY = screenHeight / 2 - (rect.y + rect.height / 2);

      // Guardamos la transformación
      setTransform(`translate(${translateX}px, ${translateY}px) scale(2.5)`);
      setIsExpanded(true);
    } else {
      setTransform("");
      setIsExpanded(false);
    }
  };

  // Función para abrir la tarjeta (solo se llama si no está expandida)
  const handleCardClick = () => {
    if (!isExpanded) {
      toggleExpanded();
    }
  };

  // Función para detener la propagación del evento, evitando que se llame handleCardClick o toggleExpanded.
  const handleInnerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={cardRef}
      className={`evento ${isExpanded ? "expanded" : ""}`}
      // La primera vez que se hace clic (isExpanded es false), llama a toggleExpanded.
      // Cuando ya está expandida, no hace nada gracias a la condición dentro de handleCardClick.
      onClick={handleCardClick}
      style={{
        transform: transform,
      }}
    >
      <header>
        <h3>{nombre}</h3>
        <button onClick={toggleExpanded} className="cerrar">
          Cerrar
        </button>
      </header>
      <p className="desde">Desde: ${tipo1}</p>
      <div className="eventoDesc" onClick={handleInnerClick}>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
          dolorem voluptate quidem alias recusandae.
        </p>
        <div className="precios">
          <div className="precio">
            <p>Primera Clase: ${tipo3}</p>
            <button>Comprar</button>
          </div>
          <div className="precio">
            <p>Segunda Clase: ${tipo2}</p>
            <button>Comprar</button>
          </div>
          <div className="precio">
            <p>Tercera Clase: ${tipo1}</p>
            <button>Comprar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventoCard;
