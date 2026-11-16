import axios from "axios";

// HRServices (.NET, https://localhost:7101/api in development).
// In production this is proxied by nginx under the same origin, which avoids CORS.
const HttpHR = axios.create({
  baseURL: process.env.REACT_APP_HR_API || "/dotnet/hr/api",
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
