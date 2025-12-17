import api from "./api";

export const createProduct = async (data) => {
  const res = await api.post("/products", data);
  return res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const getAllProducts = async () => {
  const res = await api.get("/products");
  return res.data; // <-- FIXED
};

export const removeProduct = async (id) => {
  await api.delete(`/products/${id}`);
};

export default {
  createProduct,
  getProductById,
  updateProduct,
  getAllProducts,
  removeProduct,
};
