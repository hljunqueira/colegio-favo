export const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:3001"
    : "https://api.escolafavodemel.com.br");

export const API = `${BACKEND_URL}/api`;

export default API;
