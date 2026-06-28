import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import TodoCard from "../components/TodoCard";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "pending" | "completed"
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchTodos = useCallback(async () => {
    try {
      const response = await api.get("/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
    document.title = "Todo List — Todo App";
  }, [fetchTodos]);

  // Add a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await api.post("/todos", {
        title: title.trim(),
        description: description.trim(),
      });
      setTitle("");
      setDescription("");
      fetchTodos();
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  // Filter & Search
  const filteredTodos = todos.filter((todo) => {
    // Search
    if (
      searchQuery &&
      !todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter
    if (filter === "pending") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  // Stats
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title" id="page-title">📋 My Todos</h1>
        <p className="page-subtitle">
          Manage your daily tasks — stay organized, stay productive.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-bar" id="stats-bar">
        <div className="stat-card total">
          <div className="stat-number" id="stat-total">{totalCount}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card done">
          <div className="stat-number" id="stat-completed">{completedCount}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-number" id="stat-pending">{pendingCount}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      {/* Add Todo Form */}
      <form className="add-todo-form" onSubmit={handleAddTodo} id="add-todo-form">
        <h3>➕ Add New Todo</h3>
        <div className="form-row">
          <input
            type="text"
            className="form-input"
            placeholder="Todo title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="input-title"
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            className="form-input"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="input-description"
          />
          <button type="submit" className="btn btn-primary" id="btn-add-todo">
            Add Todo
          </button>
        </div>
      </form>

      {/* Search & Filter */}
      <div className="toolbar" id="toolbar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-input"
          />
        </div>
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
          id="filter-all"
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
          id="filter-pending"
        >
          Pending
        </button>
        <button
          className={`filter-btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
          id="filter-completed"
        >
          Completed
        </button>
      </div>

      {/* Todo List */}
      {filteredTodos.length === 0 ? (
        <div className="empty-state" id="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">
            {searchQuery
              ? "No matching todos"
              : filter !== "all"
              ? `No ${filter} todos`
              : "No todos yet"}
          </div>
          <div className="empty-state-text">
            {searchQuery
              ? "Try a different search term."
              : "Add your first todo above to get started!"}
          </div>
        </div>
      ) : (
        <div className="todo-list" id="todo-list">
          {filteredTodos.map((todo) => (
            <TodoCard key={todo.id} todo={todo} fetchTodos={fetchTodos} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoList;