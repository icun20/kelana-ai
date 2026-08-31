export const API_BASE = "http://localhost:8000";

export const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("kelana_token");
};

export const setStoredToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("kelana_token", token);
  }
};

export const clearStoredToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("kelana_token");
  }
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const logoutUser = (router?: { replace: (path: string) => void }) => {
  clearStoredToken();
  if (router) router.replace("/login");
};
