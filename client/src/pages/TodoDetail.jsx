import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { deleteTodo, getTodo, updateTodo } from "../api";
import TodoForm from "../components/TodoForm";
import "../styles.css";

function formatDateTime(value) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function TodoDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const todoId = params.get("id");
  const [todo, setTodo] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function loadTodo() {
    if (!todoId) {
      setError("Todo id query parameter is required.");
      setIsLoading(false);
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const data = await getTodo(todoId);
      setTodo(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTodo();
  }, [todoId]);

  async function handleUpdate(updatedTodo) {
    setError("");
    try {
      const data = await updateTodo(todo.id, updatedTodo);
      setTodo(data);
      setIsEditing(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleDelete() {
    setError("");
    try {
      await deleteTodo(todo.id);
      window.location.href = "/";
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Todo Detail</p>
          <h1>{todo ? todo.title : "Todo"}</h1>
          <p className="subtle">This page is loaded separately and reads the todo id from the URL.</p>
        </div>
        <a className="button secondary" href="/">
          Back to list
        </a>
      </header>

      {error && <p className="error">{error}</p>}

      {isLoading ? (
        <p className="loading">Loading todo...</p>
      ) : todo ? (
        <section className="detail-grid">
          <article className="detail-panel">
            <div className="meta">
              <span className={`badge ${todo.priority}`}>{todo.priority}</span>
              <span>{todo.completed ? "Completed" : "Active"}</span>
              <span>{todo.dueDate ? `Due ${todo.dueDate}` : "No due date"}</span>
            </div>

            <h2>Description</h2>
            <p className="description">{todo.description || "No description added."}</p>

            <p className="subtle">Created {formatDateTime(todo.createdAt)}</p>
            <p className="subtle">Updated {formatDateTime(todo.updatedAt)}</p>

            <div className="button-row">
              <button className="button" type="button" onClick={() => setIsEditing(true)}>
                Edit
              </button>
              <button className="button warning" type="button" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </article>

          <aside className="panel">
            <h2>{isEditing ? "Edit todo" : "Quick status"}</h2>
            {isEditing ? (
              <TodoForm
                initialTodo={todo}
                submitLabel="Save changes"
                onSubmit={handleUpdate}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <TodoForm
                initialTodo={todo}
                submitLabel={todo.completed ? "Mark active" : "Mark complete"}
                onSubmit={(currentTodo) =>
                  handleUpdate({
                    ...currentTodo,
                    completed: !todo.completed
                  })
                }
              />
            )}
          </aside>
        </section>
      ) : (
        <div className="empty-state">Todo was not found.</div>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TodoDetailPage />
  </React.StrictMode>
);
