import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "https://myinvoice-f70e.onrender.com/api";

const api = axios.create({
  // baseURL: "http://localhost:8080/api",
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;