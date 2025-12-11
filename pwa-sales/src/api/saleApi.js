import api from "./api";

export const createSale = (data) => api.post("/sales", data);
export const getSaleById = (id) => api.get(`/sales/${id}`);
export const updateSale = (id, data) => api.put(`/sales/${id}`, data);
export const getAllSales = () => api.get("/sales");
export const removeSale = (id) => api.delete(`/sales/${id}`);

const saleApi = {
  createSale,
  getSaleById,
  updateSale,
  getAllSales,
  removeSale,
};

export default saleApi;
