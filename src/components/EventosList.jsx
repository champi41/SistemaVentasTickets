import React from "react";
import EventoItem from "./EventoItem";

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

      <div className="busqueda">
        <input
          value={q}

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
                  <EventoItem
                    key={ev._id}
                    evento={ev}
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
