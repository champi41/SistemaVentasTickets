import React from "react";


export default function EventoItem({ evento, onClick }) {
  return (
    <article className="evento" onClick={onClick}>
      <div className="evento-imagen">

        <img
          src={evento?.image}
          alt={evento?.name}

          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "https://placehold.co/600x400/eee/ccc?text=Evento";
          }}
        />
      </div>

      <div className="evento-info">
        <h3>{evento?.name || "Evento sin nombre"}</h3>
        <p>
          <strong>Categoría:</strong> {evento?.category || "No especificada"}
        </p>
        <p>
          <strong>Lugar:</strong> {evento?.location || "No especificado"}
        </p>
        <p>
          <strong>Fecha:</strong>{" "}
          {evento?.date
            ? new Date(evento.date).toLocaleString("es-CL", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "Fecha no disponible"}
        </p>
      </div>
    </article>
  );
}
