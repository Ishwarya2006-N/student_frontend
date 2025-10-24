import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api", // backend base
  withCredentials: true, // allow cookies
});

export default API;
