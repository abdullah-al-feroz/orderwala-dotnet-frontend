import axios from "axios";

const HttpUser = axios.create({
  baseURL: "https://localhost:7084/api/UserManagement",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

HttpUser.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default HttpUser;