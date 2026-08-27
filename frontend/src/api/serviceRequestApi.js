import { client, extractErrorMessage } from "./authApi";

export async function getMyRequests() {
  try {
    const response = await client.get("/api/requests");
    return { success: true, requests: response.data };
  } catch (error) {
    return {
      success: false,
      message: extractErrorMessage(error, "Could not load your service requests."),
    };
  }
}

export async function getRequestById(id) {
  try {
    const response = await client.get(`/api/requests/${id}`);
    return { success: true, request: response.data };
  } catch (error) {
    return {
      success: false,
      message: extractErrorMessage(error, "Could not load that service request."),
    };
  }
}

export async function createRequest({ title, description, category }) {
  try {
    const response = await client.post("/api/requests", {
      title,
      description,
      category,
    });
    return { success: true, request: response.data };
  } catch (error) {
    return {
      success: false,
      message: extractErrorMessage(error, "Could not create the service request."),
    };
  }
}

export async function updateRequest(id, { title, description, category }) {
  try {
    const response = await client.put(`/api/requests/${id}`, {
      title,
      description,
      category,
    });
    return { success: true, request: response.data };
  } catch (error) {
    return {
      success: false,
      message: extractErrorMessage(error, "Could not update the service request."),
    };
  }
}

export async function deleteRequest(id) {
  try {
    await client.delete(`/api/requests/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: extractErrorMessage(error, "Could not delete the service request."),
    };
  }
}
