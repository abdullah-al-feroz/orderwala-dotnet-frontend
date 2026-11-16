import axios from "axios";

const HttpSupplyChain = axios.create({
  baseURL: "https://localhost:7031/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

HttpSupplyChain.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default HttpSupplyChain;