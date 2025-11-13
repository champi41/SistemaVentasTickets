import { api } from "./client";

export const createReservation = ({ event_id, items }) =>
  api.post(`/reservations`, { event_id, items });

export const getReservation = (res_id) => api.get(`/reservations/${res_id}`);
