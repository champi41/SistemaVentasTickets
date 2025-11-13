const API_URL = import.meta.env.VITE_API_URL;

export async function getEvents(query = "", limit = 100, page = 1) {
  const url = new URL(`${API_URL}/events`);
  url.searchParams.append("limit", limit);
  url.searchParams.append("page", page);
  if (query) url.searchParams.append("q", query);

  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al obtener eventos");
  return await response.json();
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

