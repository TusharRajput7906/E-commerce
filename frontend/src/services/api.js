import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // cookies (JWT token) automatically bhejne ke liye
});

export default api;