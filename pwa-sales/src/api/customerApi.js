// import api from "./api";

// export const createCustomer = (data) => api.post("/customers", data);
// export const getCustomerById = (id) => api.get(`/customers/${id}`);
// export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
// export const getAllCustomers = () => api.get("/customers");
// export const removeCustomer = (id) => api.delete(`/customers/${id}`);

// const customerApi = {
//   createCustomer,
//   getCustomerById,
//   updateCustomer,
//   getAllCustomers,
//   removeCustomer,
// };

// export default customerApi;

import api from "./api";

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

export default {
  createCustomer,
  getCustomerById,
  updateCustomer,
  getAllCustomers,
  removeCustomer,
}