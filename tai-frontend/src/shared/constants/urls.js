// Prefer .env; otherwise choose based on hostname (prod vs local)
let DEFAULT_API_BASE = "http://localhost:8000";
try {
  if (typeof window !== "undefined") {
    const host = window.location.hostname || "";
    const protocol = window.location.protocol === "https:" ? "https" : "http";
    // If we're on taiteach.com (frontend), default API to api.taiteach.com and match protocol
    if (host.endsWith("taiteach.com")) {
      DEFAULT_API_BASE = `${protocol}://api.taiteach.com`;
    }
  }
} catch (_) {
  // non-browser runtime; keep localhost default
}

const API_BASE_URL = process.env.REACT_APP_API_URL || DEFAULT_API_BASE;
export { API_BASE_URL };