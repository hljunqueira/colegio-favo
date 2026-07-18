export const TOKEN_KEY = "favo_token";
export const USER_KEY = "favo_user";

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user || {}));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function authHeader() {
  const t = getToken();
  return t ? { headers: { Authorization: `Bearer ${t}` } } : {};
}

export function formatErr(detail) {
  if (!detail) return "Ocorreu um erro. Tente novamente.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e?.msg || "").join(" ");
  return "Ocorreu um erro. Tente novamente.";
}
