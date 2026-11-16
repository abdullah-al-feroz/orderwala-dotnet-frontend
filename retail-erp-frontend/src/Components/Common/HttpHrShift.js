import axios from "axios";

// UserManagementServices (.NET, https://localhost:7084/api/ in development).
// In production this is proxied by nginx under the same origin, which avoids CORS.
const HttpHrShift = axios.create({
  baseURL: process.env.REACT_APP_HR_SHIFT_API || "/dotnet/um/api/",
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
