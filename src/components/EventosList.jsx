import React from "react";
import EventoItem from "./EventoItem";

// 2. COMPONENTE "EVENTOS" (Sección)
// Este componente recibe todo lo necesario para renderizar la sección:
// - Estados (q, loading, isTyping, eventosPagina, totalPages, page)
// - Manejadores de eventos (onQueryChange, onEventoClick, onPageChange)

export default function EventosList({
  q,
  onQueryChange,
  loading,
  isTyping,
  eventosPagina,
  onEventoClick,
  totalPages,
  page,
  onPageChange,
}) {
  return (
    <section className="eventos">
      {/* BUSCADOR */}
      <div className="busqueda">
        <input
          value={q}
          // El 'onChange' ahora llama a la prop 'onQueryChange'
          // que viene desde Home.
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar evento..."
        />
      </div>

      {/* LISTADO DE EVENTOS */}
      {loading && !isTyping ? (
        <p>Cargando eventos...</p>
      ) : (
        <>
          <div className="lista">
            {eventosPagina.length
              ? eventosPagina.map((ev) => (
                  // Usamos el nuevo componente EventoItem aquí
                  <EventoItem
                    key={ev._id}
                    evento={ev}
                    // Pasamos la función de click al componente hijo
                    onClick={() => onEventoClick(ev._id)}
                  />
                ))
              : !loading && <p>No hay eventos disponibles</p>}
          </div>

          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <div className="paginacion">
              {/* ANTERIOR */}
              <button
                // La lógica de paginación ahora usa la prop 'onPageChange'
                onClick={() => onPageChange((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ‹ Anterior
              </button>

              {/* PÁGINAS */}
              {Array.from({ length: totalPages }, (_, i) => {
                const num = i + 1;
                return (
                  <button
                    key={num}
                    className={num === page ? "activa" : ""}
                    onClick={() => onPageChange(num)}
                  >
                    {num}
                  </button>
                );
              })}

              {/* SIGUIENTE */}
              <button
                onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Siguiente ›
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
