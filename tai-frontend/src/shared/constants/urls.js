// Shoudl never hit this localhost should pull it from the .env, unless something is wrong
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
export { API_BASE_URL };