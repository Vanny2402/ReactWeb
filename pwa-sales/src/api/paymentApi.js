import api from "./api";

export const createPayment = (data) => api.post("/payments", data);
export const getPaymentById = (id) => api.get(`/payments/${id}`);
export const updatePayment = (id, data) => api.put(`/payments/${id}`, data);
export const getAllPayments = () => api.get("/payments");
export const getAllPaymentForReport = () => api.get("/payments/reports");

export const removePayment = (id) => api.delete(`/payments/${id}`);

const paymentApi = {
  createPayment,
  getPaymentById,
  updatePayment,
  getAllPayments,
  removePayment,
  getAllPaymentForReport,
};

export default paymentApi;
