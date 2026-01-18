import api from "./api";

export const createSale = (data) => api.post("/sales", data);
export const getSaleById = (id) => api.get(`/sales/${id}`);
export const updateSale = (id, data) => api.put(`/sales/${id}`, data);
export const getAllSales = () => api.get("/sales");
export const removeSale = (id) => api.delete(`/sales/${id}`);


/**
 * ✅ IMPORTANT: send page & size as query params
 */
export const getSaleCurrentMonthWithItemDto = ({ page, size }) =>
  api.get("/sales/current-month-dto/month", {
    params: { page, size },
  });

export const getSalesByDate = ({ startDate, endDate, page, size }) =>
  api.get("/sales/by-date", {
    params: { startDate, endDate, page, size },
  });


const saleApi = {
  createSale,
  getSaleById,
  updateSale,
  getAllSales,
  removeSale,
  getSaleCurrentMonthWithItemDto,
  getSalesByDate,
};
///07462288

export default saleApi;
