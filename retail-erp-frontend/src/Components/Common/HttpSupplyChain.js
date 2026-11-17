import axios from "axios";

// SupplyChainServices (.NET). REACT_APP_SC_API is set in the env files;
// the fallback keeps the nginx same-origin proxy used by the Docker image.
const HttpSupplyChain = axios.create({
  baseURL: process.env.REACT_APP_SC_API || "/dotnet/sc/api",
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
