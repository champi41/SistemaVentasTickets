import EventoCard from "./EventoCard";
export default function Eventos({ eventos }) {
  return (
    <div className="eventos">
      <h2>Eventos Disponibles</h2>
      <div className="lista">
        {Array.isArray(eventos) && eventos.length > 0 ? (
          eventos.map((ev) => (
            <EventoCard
              imagen={ev.image}
              nombre={ev.name}
              lugar={ev.location}
              fecha={ev.date}
              tickets={ev.tickets}
              key={ev._id}
            />
          ))
        ) : (
          <p>No hay eventos disponibles</p>
        )}
      </div>
    </div>
  );
}
