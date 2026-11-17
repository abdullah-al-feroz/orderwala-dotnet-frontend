import axios from "axios";

// UserManagementServices (.NET). REACT_APP_USER_API is set in the env files;
// the fallback keeps the nginx same-origin proxy used by the Docker image.
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
