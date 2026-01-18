import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8080/api",
  baseURL: "https://myinvoice-f70e.onrender.com/api",
  // baseURL: "https://myinvoice-server.onrender.com/api", //BongSongha
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;  