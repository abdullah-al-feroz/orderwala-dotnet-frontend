import axios from "axios";

// SupplyChainServices (.NET, https://localhost:7031/api in development).
// In production this is proxied by nginx under the same origin, which avoids CORS.
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
