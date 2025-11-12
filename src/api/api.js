const API_URL = import.meta.env.VITE_API_URL;

export async function getEvents() {
  const response = await fetch(`${API_URL}/events`);
  const data = await response.json();
  return data;
}

export async function createReservation(eventId, ticketType, quantity) {
  const res = await fetch(`${API_BASE_URL}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_id: eventId, ticket_type: ticketType, quantity }),
  });
  if (!res.ok) throw new Error("Error al crear reserva");
  return res.json();
}

export async function confirmCheckout(reservationId) {
  const res = await fetch(`${API_BASE_URL}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reservation_id: reservationId }),
  });
  if (!res.ok) throw new Error("Error en el checkout");
  return res.json();
}

export async function getPurchases() {
  const res = await fetch(`${API_BASE_URL}/purchases`);
  if (!res.ok) throw new Error("Error al obtener historial de compras");
  return res.json();
}