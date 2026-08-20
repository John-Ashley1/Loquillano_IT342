import axios from "axios";

// All backend communication lives here. If your Spring Boot backend's
// URL, field names, or endpoint paths differ, this is the only file
// you should need to touch.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Normalizes an axios error into a plain, user-facing message.
 * The backend returns plain-text bodies for errors (not JSON), e.g.
 * "Username already exists" or "Invalid username or password".
 */
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

/**
 * Strips the password field out of a user object before it is ever
 * kept in memory/session storage or rendered back to the screen.
 */
function sanitizeUser(user) {
  if (!user || typeof user !== "object") return user;
  const { password, ...safeUser } = user;
  return safeUser;
}

// POST /api/register
export async function registerUser({ username, password }) {
  try {
    const response = await client.post("/api/register", { username, password });
    return { success: true, user: sanitizeUser(response.data) };
  } catch (error) {
    return {
      success: false,
      message: extractErrorMessage(error, "Registration failed. Please try again."),
    };
  }
}

// POST /api/login
export async function loginUser({ username, password }) {
  try {
    const response = await client.post("/api/login", { username, password });
    return { success: true, user: sanitizeUser(response.data) };
  } catch (error) {
    return {
      success: false,
      message: extractErrorMessage(error, "Login failed. Please try again."),
    };
  }
}

// GET /api/user/{id}
export async function getUserById(id) {
  try {
    const response = await client.get(`/api/user/${id}`);
    return { success: true, user: sanitizeUser(response.data) };
  } catch (error) {
    return {
      success: false,
      message: extractErrorMessage(error, "Could not load user."),
    };
  }
}
