import axios from "axios";

// HRServices (.NET). REACT_APP_HR_API is set in .env.development / .env.production;
// the fallback keeps the nginx same-origin proxy used by the Docker image.
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
