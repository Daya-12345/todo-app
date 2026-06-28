import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function TodoDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No todo ID provided.");
      setLoading(false);
      return;
    }

    const fetchTodo = async () => {
      try {
        const response = await api.get(`/todos/${id}`);
        setTodo(response.data);
        setEditTitle(response.data.title);
        setEditDescription(response.data.description || "");
        document.title = `${response.data.title} — Todo App`;
      } catch (err) {
        console.error("Error fetching todo:", err);
        setError("Todo not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  const toggleStatus = async () => {
    try {
      await api.put(`/todos/${id}`, { completed: !todo.completed });
      setTodo((prev) => ({ ...prev, completed: !prev.completed }));
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    try {
      const response = await api.put(`/todos/${id}`, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      setTodo(response.data.todo);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/todos/${id}`);
      navigate("/");
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setIsEditing(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner" />
          <div className="loading-text">Loading todo...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !todo) {
    return (
      <div className="page-container">
        <div className="error-state" id="error-state">
          <div className="error-state-icon">😕</div>
          <div className="error-state-title">{error || "Todo not found"}</div>
          <div className="error-state-text">
            The todo you&apos;re looking for doesn&apos;t exist or has been deleted.
          </div>
          <Link to="/" className="btn btn-primary" id="btn-go-home">
            ← Back to Todos
          </Link>
        </div>
      </div>
    );
  }

  const createdDate = todo.createdAt
    ? new Date(todo.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <div className="page-container">
      <div className="detail-page">
        {/* Back Link */}
        <Link to="/" className="back-link" id="back-link">
          ← Back to Todos
        </Link>

        {/* Detail Card */}
        <div className="detail-card" id="detail-card">
          {/* Header */}
          <div className="detail-card-header">
            {isEditing ? (
              <div className="edit-form" style={{ flex: 1 }}>
                <input
                  type="text"
                  className="form-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Todo title..."
                  autoFocus
                  id="edit-title"
                />
                <textarea
                  className="form-input"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description (optional)"
                  rows={3}
                  id="edit-description"
                />
                <div className="edit-form-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    id="btn-save"
                  >
                    💾 Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                    id="btn-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="detail-card-title" id="detail-title">
                  {todo.title}
                </h1>
                <span
                  className={`status-badge ${
                    todo.completed ? "completed" : "pending"
                  }`}
                  id="detail-status-badge"
                >
                  {todo.completed ? "✅ Completed" : "⏳ Pending"}
                </span>
              </>
            )}
          </div>

          {/* Body */}
          {!isEditing && (
            <div className="detail-card-body">
              {/* Description */}
              <div className="detail-field">
                <div className="detail-field-label">Description</div>
                <div className="detail-field-value" id="detail-description">
                  {todo.description || "No description provided."}
                </div>
              </div>

              {/* Status */}
              <div className="detail-field">
                <div className="detail-field-label">Status</div>
                <div className="detail-field-value" id="detail-status">
                  {todo.completed ? "✅ Completed" : "❌ Pending"}
                </div>
              </div>

              {/* Created Date */}
              <div className="detail-field">
                <div className="detail-field-label">Created At</div>
                <div className="detail-field-value" id="detail-created">
                  {createdDate}
                </div>
              </div>

              {/* Todo ID */}
              <div className="detail-field">
                <div className="detail-field-label">Todo ID</div>
                <div className="detail-field-value" id="detail-id">
                  {todo.id}
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          {!isEditing && (
            <div className="detail-card-footer">
              <button
                className={`btn ${
                  todo.completed ? "btn-warning" : "btn-success"
                }`}
                onClick={toggleStatus}
                id="btn-toggle-status"
              >
                {todo.completed ? "↩ Mark Pending" : "✓ Mark Complete"}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
                id="btn-edit"
              >
                ✏️ Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                id="btn-delete"
              >
                🗑 Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoDetails;