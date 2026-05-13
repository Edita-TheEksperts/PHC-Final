// Small client-side auth helpers. The server is authoritative — these only
// prevent the dashboard from rendering with a stale/expired token in localStorage,
// which was causing the wrong user (e.g. Bruno Roth / Sandra Keller) to flash up
// after a session timeout.

function decodeJwtPayload(token) {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false; // no exp = trust server
  return payload.exp * 1000 <= Date.now();
}

// Clear every auth-related key any page sets in localStorage.
// We don't blanket-clear() because non-auth keys (e.g. form drafts) may live here.
export function clearAuthStorage() {
  if (typeof window === "undefined") return;
  const keys = [
    "userToken",
    "userRole",
    "userId",
    "userName",
    "email",
    "employeeEmail",
    "employeeAgbAccepted",
  ];
  for (const k of keys) localStorage.removeItem(k);
  try { sessionStorage.clear(); } catch {}
}

// Wrap fetch so any 401 from a protected API forces a clean logout + redirect.
export async function authFetch(input, init) {
  const res = await fetch(input, init);
  if (res.status === 401 && typeof window !== "undefined") {
    clearAuthStorage();
    if (!window.location.pathname.startsWith("/login")) {
      window.location.replace("/login");
    }
  }
  return res;
}
