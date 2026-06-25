import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createTodo, getTodos, updateTodo } from "../api";
import TodoForm from "../components/TodoForm";
import "../styles.css";

function formatDate(dateValue) {
  if (!dateValue) {
    return "No due date";
  }
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(dateValue));
}

function TodoListPage() {
  const [todos, setTodos] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    sort: "createdAt"
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadTodos(nextFilters = filters) {
    setIsLoading(true);
    setError("");
    try {
      const data = await getTodos(nextFilters);
      setTodos(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function handleCreate(todo) {
    setError("");
    try {
      await createTodo(todo);
      await loadTodos();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleToggle(todo) {
    setError("");
    try {
      await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed
      });
      await loadTodos();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function handleFilterChange(event) {
    const { name, value } = event.target;
    const nextFilters = {
      ...filters,
      [name]: value
    };
    setFilters(nextFilters);
    loadTodos(nextFilters);
  }

  const summary = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length;
    return {
      total: todos.length,
      completed,
      active: todos.length - completed
    };
  }, [todos]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Ziptrrip Todo Manager</p>
          <h1>Todos</h1>
          <p className="subtle">Create, filter, update, and open individual todo records.</p>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="layout">
        <aside className="panel">
          <h2>Add todo</h2>
          <TodoForm submitLabel="Add todo" onSubmit={handleCreate} />
        </aside>

        <section>
          <div className="summary-grid" aria-label="Todo summary">
            <div className="summary-item">
              <strong>{summary.total}</strong>
              Total
            </div>
            <div className="summary-item">
              <strong>{summary.active}</strong>
              Active
            </div>
            <div className="summary-item">
              <strong>{summary.completed}</strong>
              Completed
            </div>
          </div>

          <div className="controls">
            <label>
              Search
              <input
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search title or description"
              />
            </label>

            <label>
              Status
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </label>

            <label>
              Sort
              <select name="sort" value={filters.sort} onChange={handleFilterChange}>
                <option value="createdAt">Newest</option>
                <option value="dueDate">Due date</option>
                <option value="priority">Priority</option>
              </select>
            </label>
          </div>

          {isLoading ? (
            <p className="loading">Loading todos...</p>
          ) : todos.length === 0 ? (
            <div className="empty-state">No todos match the current view.</div>
          ) : (
            <div className="todo-list">
              {todos.map((todo) => (
                <article className={`todo-row ${todo.completed ? "completed" : ""}`} key={todo.id}>
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo)}
                    aria-label={`Mark ${todo.title} as ${todo.completed ? "active" : "complete"}`}
                  />
                  <div>
                    <h3 className="todo-title">{todo.title}</h3>
                    <div className="meta">
                      <span className={`badge ${todo.priority}`}>{todo.priority}</span>
                      <span>{formatDate(todo.dueDate)}</span>
                    </div>
                  </div>
                  <a className="button secondary" href={`/todo.html?id=${todo.id}`}>
                    Open
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TodoListPage />
  </React.StrictMode>
);
