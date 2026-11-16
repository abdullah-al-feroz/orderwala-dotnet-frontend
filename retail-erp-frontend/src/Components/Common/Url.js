// Base URL used for uploaded files (vendor documents, etc.).
// Development used http://127.0.0.1:8000/ (Laravel `artisan serve` docroot).
// In production this points at the PHP app's public folder. Verify this value
// against your actual file location before deploying.
const url =
  process.env.REACT_APP_FILE_BASE || "https://backend.orderwalabd.com/public/";

export default url;
