
const EventoCard = ({imagen, nombre, lugar, fecha, tickets}) => {
  
  return (
    <div className="evento">
      <img
        src={imagen}
        alt={nombre}
        style={{
          width: "100%",
          marginBottom: "0.5rem",
        }}
      />
      <h3>{nombre}</h3>
      <p>
        <strong>Lugar:</strong> {lugar}
      </p>
      <p>
        <strong>Fecha:</strong>{" "}
        {new Date(fecha).toLocaleString("es-CL", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>
      <h4>Entradas disponibles:</h4>
      <ul>
        {tickets.map((t, i) => (
          <li key={i}>
            {t.type} — ${t.price.toLocaleString()} (Disponibles: {t.available})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventoCard;
