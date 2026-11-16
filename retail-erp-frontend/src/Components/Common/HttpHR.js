import axios from "axios";

const HttpHR = axios.create({
  baseURL: "https://localhost:7101/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

HttpHR.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default HttpHR;