import axios from "axios";

// UserManagementServices (.NET, https://localhost:7084/api/UserManagement in development).
// In production this is proxied by nginx under the same origin, which avoids CORS.
const HttpUser = axios.create({
  baseURL: process.env.REACT_APP_USER_API || "/dotnet/um/api/UserManagement",
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
