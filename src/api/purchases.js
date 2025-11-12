// src/api/purchases.js
import { api } from "./client";

export const getPurchase = (purchase_id) => {
  return api.get(`/purchases/${purchase_id}`);
};
