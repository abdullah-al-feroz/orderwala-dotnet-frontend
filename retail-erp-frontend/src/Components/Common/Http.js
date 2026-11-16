import axios from "axios";

// PHP (Laravel) API. Create React App inlines REACT_APP_* at BUILD time,
// so this must be set before `npm run build` (see .env.production / Dockerfile).
const url =
  process.env.REACT_APP_PHP_API || "https://backend.orderwalabd.com/public/api";

export default axios.create({
  url: url,
  baseURL: url,
  headers: {
    Accept: "application/json",
    // "Content-Type": "multipart/form-data",
    // Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "*",
  },
});
