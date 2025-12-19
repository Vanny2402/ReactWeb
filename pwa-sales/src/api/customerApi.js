import api from "./api";

// -------------------- Customer CRUD --------------------
export const createCustomer = async (data) => {
  const res = await api.post("/customers", data);
  return res.data;
};

export const getCustomerById = async (id) => {
  const res = await api.get(`/customers/${id}`);
  return res.data;
};

export const updateCustomer = async (id, data) => {
  const res = await api.put(`/customers/${id}`, data);
  return res.data;
};

export const getAllCustomers = async () => {
  const res = await api.get("/customers");
  return res.data;
};

export const removeCustomer = async (id) => {
  await api.delete(`/customers/${id}`);
};

// -------------------- New Endpoints --------------------

// Get all payments by customerId
export const getPaymentsByCustomerId = async (id) => {
  const res = await api.get(`/customers/${id}/payments`);
  return res.data;
};

// Get all sales by customerId
export const getSalesByCustomerId = async (id) => {
  const res = await api.get(`/customers/${id}/sales`);
  return res.data;
};

// -------------------- Export --------------------
export default {
  createCustomer,
  getCustomerById,
  updateCustomer,
  getAllCustomers,
  removeCustomer,
  getPaymentsByCustomerId,
  getSalesByCustomerId,
};
