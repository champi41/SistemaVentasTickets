import { api } from "./client";

export const checkout = ({ reservation_id, buyer }) =>
  api.post(`/checkout`, { reservation_id, buyer });
