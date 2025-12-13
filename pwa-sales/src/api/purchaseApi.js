// src/api/purchaseApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

const BASE_URL = "/purchases";

export const getPurchasesByMonthYear = async ({ month, year }) => {
  const res = await api.get(`${BASE_URL}/filter`, { params: { month, year } });
  const data = res.data;
  return Array.isArray(data) ? data : data.content || [];
};

export const getPurchaseById = async (id) => {
  const res = await api.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const getPurchaseItems = async (id, page = 0, size = 10) => {
  const res = await api.get(`${BASE_URL}/${id}/items`, { params: { page, size } });
  return res.data; // Page<ItemDTO>
};

export const createPurchase = async (data) => {
  const res = await api.post(BASE_URL, data);
  return res.data;
};

// ✅ Update
export const updatePurchase = async (id, data) => {
  const res = await api.put(`${BASE_URL}/${id}`, data);
  return res.data;
};

// ✅ Delete
export const deletePurchase = async (id) => {
  await api.delete(`${BASE_URL}/${id}`);
};