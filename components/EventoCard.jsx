import React, { useState } from "react";
const EventoCard = ({ nombre, precio }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  const cardClasses = `evento ${isExpanded ? "expanded" : ""}`;
  return (
    <div className={cardClasses} onClick={toggleExpanded}>
      <h3>{nombre}</h3>
      <p>Desde: ${precio}</p>
      <div className="eventoDesc">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam</p>
      </div>
    </div>
  );
};

export default EventoCard;
