export default function Eventos({ eventos }) {
  return (
    <div style={{ padding: "1rem" }}>
      <h2>🎟️ Eventos Disponibles</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {Array.isArray(eventos) && eventos.length > 0 ? (
          eventos.map((ev) => (
            <div
              key={ev._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "1rem",
                backgroundColor: "#f9f9f9",
              }}
            >
              <img
                src={ev.image}
                alt={ev.name}
                style={{
                  width: "100%",
                  marginBottom: "0.5rem",
                }}
              />
              <h3>{ev.name}</h3>
              <p>
                📍 <strong>Lugar:</strong> {ev.location}
              </p>
              <p>
                📅 <strong>Fecha:</strong>{" "}
                {new Date(ev.date).toLocaleString("es-CL", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              <h4>Entradas disponibles:</h4>
              <ul>
                {ev.tickets.map((t, i) => (
                  <li key={i}>
                    {t.type} — ${t.price.toLocaleString()} (Disponibles:{" "}
                    {t.available})
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No hay eventos disponibles</p>
        )}
      </div>
    </div>
  );
}

