import api from "./api";

export const createCustomer = (data) =>
  api.post("/customers", data);

export const getCustomerById = (id) =>
  api.get(`/customers/${id}`);

export const updateCustomer = (id, data) =>
  api.put(`/customers/${id}`, data);