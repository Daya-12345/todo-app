import { Link } from "react-router-dom";
import api from "../services/api";

function TodoCard({ todo, fetchTodos }) {
  const toggleStatus = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.put(`/todos/${todo.id}`, {
        completed: !todo.completed,
      });
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/todos/${todo.id}`);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <Link
      to={`/todo?id=${todo.id}`}
      className={`todo-card ${todo.completed ? "completed" : ""}`}
      id={`todo-card-${todo.id}`}
    >
      {/* Checkbox */}
      <div
        className={`todo-checkbox ${todo.completed ? "checked" : ""}`}
        onClick={toggleStatus}
        role="checkbox"
        aria-checked={todo.completed}
        id={`checkbox-${todo.id}`}
      />

      {/* Body */}
      <div className="todo-card-body">
        <div className="todo-card-title">{todo.title}</div>
        {todo.description && (
          <div className="todo-card-desc">{todo.description}</div>
        )}
        <div className="todo-card-meta">
          <span
            className={`status-badge ${
              todo.completed ? "completed" : "pending"
            }`}
          >
            {todo.completed ? "✅ Completed" : "⏳ Pending"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="todo-card-actions">
        <button
          className="btn-icon danger"
          onClick={deleteTodo}
          title="Delete"
          id={`delete-${todo.id}`}
        >
          🗑
        </button>
      </div>
    </Link>
  );
}

export default TodoCard;