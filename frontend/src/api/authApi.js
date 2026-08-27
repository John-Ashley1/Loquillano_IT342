import axios from "axios";
import { getToken, clearSession } from "./session";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT to every outgoing request automatically, if we have one
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend ever says our token is invalid/expired, clear it so the UI
// doesn't stay in a broken "logged in but every request fails" state
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (!error.config.url.includes("/api/login") && !error.config.url.includes("/api/register")) {
        clearSession();
      }
    }
    return Promise.reject(error);
  }
);

function extractErrorMessage(error, fallback) {
  if (error.response) {
    const data = error.response.data;
    if (typeof data === "string" && data.trim().length > 0) {
      return data;
    }
    if (data && typeof data === "object" && data.message) {
      return data.message;
    }
    if (error.response.status === 404) {
      return "Not found.";
    }
    return fallback;
  }
  if (error.request) {
    return "Could not reach the server. Is the backend running and is CORS enabled?";
  }
  return fallback;
}

function sanitizeUser(user) {
  if (!user || typeof user !== "object") return user;
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function registerUser({ username, email, password }) {
  try {
    const response = await client.post("/api/register", { username, email, password });
    return { success: true, user: sanitizeUser(response.data) };
  } catch (error) {
    return { success: false, message: extractErrorMessage(error, "Registration failed. Please try again.") };
  }
}

export async function loginUser({ username, password }) {
  try {
    const response = await client.post("/api/login", { username, password });
    return { success: true, token: response.data.token, username: response.data.username };
  } catch (error) {
    return { success: false, message: extractErrorMessage(error, "Login failed. Please try again.") };
  }
}

export async function getUserById(id) {
  try {
    const response = await client.get(`/api/user/${id}`);
    return { success: true, user: sanitizeUser(response.data) };
  } catch (error) {
    return { success: false, message: extractErrorMessage(error, "Could not load user.") };
  }
}

export { client, extractErrorMessage };