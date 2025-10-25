import axios from "axios";

const instance = axios.create({
  baseURL: "https://student-backend-1-48k0.onrender.com/api",
});

// ✅ Attach token automatically to all requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
