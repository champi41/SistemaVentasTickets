
const EventoCard = ({ nombre, tipo1, tipo2, tipo3 }) => {
  
  return (
    <div className="evento">
      <h2>{nombre}</h2>
      <p>
        Precios: ${tipo1}, ${tipo2}, ${tipo3}
      </p>
    </div>
  );
};

export default EventoCard;
