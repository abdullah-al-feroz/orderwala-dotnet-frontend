import axios from "axios";

const HttpHrShift = axios.create({
  baseURL: "https://localhost:7084/api/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

HttpHrShift.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default HttpHrShift;