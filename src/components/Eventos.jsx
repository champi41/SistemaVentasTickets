import EventoCard from "./EventoCard";
const Eventos = ({ eventos }) => {
  return (
    <div className="eventos">
      <div className="busqueda">
        <input
          type="text"
          name=""
          id=""
          placeholder="Busque eventos, artistas o lugares"
        />
      </div>
      <div className="listaEventos">
        {eventos.map((evento) => (
          <EventoCard
            key={evento.id}
            nombre={evento.nombre}
            tipo1={evento.tipo1}
            tipo2={evento.tipo2}
            tipo3={evento.tipo3}
          />
        ))}
      </div>
    </div>
  );
};

export default Eventos;
