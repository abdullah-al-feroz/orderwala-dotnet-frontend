import axios from "axios";

// UserManagementServices (.NET). REACT_APP_HR_SHIFT_API is set in the env files;
// the fallback keeps the nginx same-origin proxy used by the Docker image.
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
