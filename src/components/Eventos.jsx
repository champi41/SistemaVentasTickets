import EventoCard from "./EventoCard";
export default function Eventos({ eventos }) {
  return (
    <div className="eventos">
      <h2>🎟️ Eventos Disponibles</h2>
      <input type="text" />
      <div className="lista">
        {Array.isArray(eventos) && eventos.length > 0 ? (
          eventos.map((ev) => (
            <EventoCard nombre={ev.name} imagen={ev.image} lugar={ev.location} fecha={ev.date} tickets={ev.tickets}></EventoCard>
          ))
        ) : (
          <p>No hay eventos disponibles</p>
        )}
      </div>
    </div>
  );
}
