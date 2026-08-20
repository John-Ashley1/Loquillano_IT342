import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
    const response = await client.post("/api/register", {
      username,
      email,
      password,
    });

    return {
      success: true,
      user: sanitizeUser(response.data),
    };
  } catch (error) {
    return {
      success: false,
      message: extractErrorMessage(
        error,
        "Registration failed. Please try again."
      ),
    };
  }
}

export async function loginUser({ username, password }) {
  try {
    const response = await client.post("/api/login", {
      username,
      password,
    });

    return {
      success: true,
      user: sanitizeUser(response.data),
    };
  } catch (error) {
    return {
      success: false,
      message: extractErrorMessage(
        error,
        "Login failed. Please try again."
      ),
    };
  }
}

export async function getUserById(id) {
  try {
    const response = await client.get(`/api/user/${id}`);

    return {
      success: true,
      user: sanitizeUser(response.data),
    };
  } catch (error) {
    return {
      success: false,
      message: extractErrorMessage(
        error,
        "Could not load user."
      ),
    };
  }
}