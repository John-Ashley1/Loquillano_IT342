import { useEffect, useState } from "react";
import {
  getMyRequests,
  createRequest,
  updateRequest,
  deleteRequest,
} from "../api/serviceRequestApi";

const emptyForm = { title: "", description: "", category: "" };

export default function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);
    const result = await getMyRequests();
    setLoading(false);

    if (result.success) {
      setRequests(result.requests);
    } else {
      setMessage({ type: "error", text: result.message });
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit(request) {
    setEditingId(request.id);
    setForm({
      title: request.title || "",
      description: request.description || "",
      category: request.category || "",
    });
    setMessage(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (!form.title.trim()) {
      setMessage({ type: "error", text: "Title is required." });
      return;
    }

    setSubmitting(true);

    const result = editingId
      ? await updateRequest(editingId, form)
      : await createRequest(form);

    setSubmitting(false);

    if (result.success) {
      setMessage({
        type: "success",
        text: editingId ? "Service request updated." : "Service request created.",
      });
      setForm(emptyForm);
      setEditingId(null);
      loadRequests();
    } else {
      setMessage({ type: "error", text: result.message });
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this service request? This cannot be undone.");
    if (!confirmed) return;

    setMessage(null);
    const result = await deleteRequest(id);

    if (result.success) {
      setMessage({ type: "success", text: "Service request deleted." });
      if (editingId === id) cancelEdit();
      loadRequests();
    } else {
      setMessage({ type: "error", text: result.message });
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>My Service Requests</h1>
        <p className="subtitle">Create, view, update, and delete your own service requests.</p>

        {message && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ marginBottom: "2rem" }}>
          <h2>{editingId ? "Edit Service Request" : "New Service Request"}</h2>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              name="category"
              type="text"
              value={form.category}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting
              ? editingId
                ? "Saving..."
                : "Creating..."
              : editingId
              ? "Save Changes"
              : "Create Request"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn-secondary"
              onClick={cancelEdit}
              style={{ marginLeft: "0.5rem" }}
            >
              Cancel
            </button>
          )}
        </form>

        <h2>Your Requests</h2>

        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p>You don't have any service requests yet.</p>
        ) : (
          <table className="requests-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td>{r.category}</td>
                  <td>{r.description}</td>
                  <td>{r.dateCreated ? new Date(r.dateCreated).toLocaleString() : ""}</td>
                  <td>
                    <button className="btn-link" onClick={() => startEdit(r)}>
                      Edit
                    </button>
                    <button className="btn-link btn-danger" onClick={() => handleDelete(r.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
