import { api } from "./client";

export const listEvents = (q = "") =>
  api.get(`/events${q ? `?q=${encodeURIComponent(q)}` : ""}`);

export const getEvent = (id) => api.get(`/events/${id}`);
