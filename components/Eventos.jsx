import EventoCard from "./EventoCard";
const Eventos = ({ eventos }) => {
  return (
    <div className="eventos">
      <h2>Eventos</h2>
      <div className="listaEventos">
        {eventos.map((evento) => (
          <EventoCard
            key={evento.id}
            nombre={evento.nombre}
            precio={evento.precio}
          />
        ))}
      </div>
    </div>
  );
};

export default Eventos;
