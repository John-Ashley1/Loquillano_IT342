// Only id/username are ever persisted here — never the password.
const SESSION_KEY = "activity1_session_user";

export function saveSession(user) {
  const { password, ...safeUser } = user || {};
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
}

export function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
