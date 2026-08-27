const TOKEN_KEY = "activity1_token";
const USERNAME_KEY = "activity1_username";

export function saveSession(token, username) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USERNAME_KEY, username);
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getUsername() {
  return sessionStorage.getItem(USERNAME_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USERNAME_KEY);
}