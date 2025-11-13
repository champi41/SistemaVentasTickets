import { api } from "./client";

export const listEvents = (q = "", limit = 100, page = 1) => {
  const params = new URLSearchParams();

  if (q) params.append("q", q);
  params.append("limit", limit);
  params.append("page", page);

  return api.get(`/events?${params.toString()}`);
};
export const getEvent = (id) => api.get(`/events/${id}`);