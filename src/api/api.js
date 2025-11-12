const API_URL = import.meta.env.VITE_API_URL;

export async function getEvents(query = "") {
  try {
    const url = query
      ? `${API_URL}/events?q=${encodeURIComponent(query)}`
      : `${API_URL}/events`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener eventos");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createReservation(eventId, ticketType, quantity) {
  const res = await fetch(`${API_URL}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_id: eventId, ticket_type: ticketType, quantity }),
  });
  if (!res.ok) throw new Error("Error al crear reserva");
  return res.json();
}

export async function confirmCheckout(reservationId) {
  const res = await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reservation_id: reservationId }),
  });
  if (!res.ok) throw new Error("Error en el checkout");
  return res.json();
}

export async function getPurchases() {
  const res = await fetch(`${API_URL}/purchases`);
  if (!res.ok) throw new Error("Error al obtener historial de compras");
  return res.json();
}

export async function createEvent(eventData) {
  try {
    const res = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!res.ok) throw new Error("Error al crear evento");
    return await res.json();
  } catch (err) {
    console.error("❌ Error en createEvent:", err);
    throw err;
  }
}