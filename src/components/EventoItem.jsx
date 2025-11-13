import React from "react";

// 1. COMPONENTE HIJO "EVENTO" (Presentacional)
// Este componente solo recibe el objeto "evento" y una función "onClick"
// No sabe nada sobre navegación ni estado, es un componente "tonto".

export default function EventoItem({ evento, onClick }) {
  return (
    <article className="evento" onClick={onClick}>
      <div className="evento-imagen">
        {/* Usamos el '?' para evitar errores si la imagen es null/undefined */}
        <img
          src={evento?.image}
          alt={evento?.name}
          // Añadimos un fallback por si la imagen falla al cargar
          onError={(e) => {
            e.target.onerror = null; // Previene bucles infinitos
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
