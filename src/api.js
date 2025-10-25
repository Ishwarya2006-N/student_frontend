// src/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // from your .env
const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`, // send token with every request
  },
});

export default api;
