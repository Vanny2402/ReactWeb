import api from "./api";

export const createProduct = (data) =>
  api.post("/products", data);

export const getProductById = (id) =>
  api.get(`/products/${id}`);

export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data);

export const getAllProducts = () =>
  api.get("/products");

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);
