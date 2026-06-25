const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const cors = require("cors");
const express = require("express");

const app = express();
const PORT = Number(process.env.PORT || 3001);
const HOST = process.env.HOST || "127.0.0.1";
const DATA_FILE = path.join(__dirname, "data", "todos.json");
const PRIORITIES = new Set(["low", "medium", "high"]);

app.use(cors());
app.use(express.json());

async function readTodos() {
  const fileContent = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(fileContent);
}

async function writeTodos(todos) {
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2));
}

function normalizeTodoInput(body, existingTodo = {}) {
  const title = typeof body.title === "string" ? body.title.trim() : existingTodo.title;
  const description =
    typeof body.description === "string" ? body.description.trim() : existingTodo.description || "";
  const completed =
    typeof body.completed === "boolean" ? body.completed : Boolean(existingTodo.completed);
  const priority =
    typeof body.priority === "string" && PRIORITIES.has(body.priority)
      ? body.priority
      : existingTodo.priority || "medium";
  const dueDate = typeof body.dueDate === "string" ? body.dueDate : existingTodo.dueDate || "";

  return {
    title,
    description,
    completed,
    priority,
    dueDate
  };
}

function validateTodoInput(todo) {
  if (!todo.title) {
    return "Title is required.";
  }

  if (todo.dueDate && Number.isNaN(Date.parse(todo.dueDate))) {
    return "Due date must be a valid date.";
  }

  return null;
}

function sortTodos(todos, sort) {
  const priorityRank = { high: 0, medium: 1, low: 2 };
  const sortedTodos = [...todos];

  if (sort === "dueDate") {
    return sortedTodos.sort((a, b) => (a.dueDate || "9999-12-31").localeCompare(b.dueDate || "9999-12-31"));
  }

  if (sort === "priority") {
    return sortedTodos.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
  }

  return sortedTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.get("/api/todos", async (request, response, next) => {
  try {
    const { search = "", status = "all", sort = "createdAt" } = request.query;
    const normalizedSearch = String(search).trim().toLowerCase();
    let todos = await readTodos();

    if (normalizedSearch) {
      todos = todos.filter((todo) => {
        const searchableText = `${todo.title} ${todo.description}`.toLowerCase();
        return searchableText.includes(normalizedSearch);
      });
    }

    if (status === "active") {
      todos = todos.filter((todo) => !todo.completed);
    }

    if (status === "completed") {
      todos = todos.filter((todo) => todo.completed);
    }

    response.json(sortTodos(todos, sort));
  } catch (error) {
    next(error);
  }
});

app.get("/api/todos/:id", async (request, response, next) => {
  try {
    const todos = await readTodos();
    const todo = todos.find((item) => item.id === request.params.id);

    if (!todo) {
      response.status(404).json({ error: "Todo not found." });
      return;
    }

    response.json(todo);
  } catch (error) {
    next(error);
  }
});

app.post("/api/todos", async (request, response, next) => {
  try {
    const todos = await readTodos();
    const todoInput = normalizeTodoInput(request.body);
    const validationError = validateTodoInput(todoInput);

    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }

    const now = new Date().toISOString();
    const newTodo = {
      id: crypto.randomUUID(),
      ...todoInput,
      createdAt: now,
      updatedAt: now
    };

    todos.unshift(newTodo);
    await writeTodos(todos);
    response.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
});

app.put("/api/todos/:id", async (request, response, next) => {
  try {
    const todos = await readTodos();
    const todoIndex = todos.findIndex((item) => item.id === request.params.id);

    if (todoIndex === -1) {
      response.status(404).json({ error: "Todo not found." });
      return;
    }

    const todoInput = normalizeTodoInput(request.body, todos[todoIndex]);
    const validationError = validateTodoInput(todoInput);

    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }

    const updatedTodo = {
      ...todos[todoIndex],
      ...todoInput,
      updatedAt: new Date().toISOString()
    };

    todos[todoIndex] = updatedTodo;
    await writeTodos(todos);
    response.json(updatedTodo);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/todos/:id", async (request, response, next) => {
  try {
    const todos = await readTodos();
    const filteredTodos = todos.filter((item) => item.id !== request.params.id);

    if (filteredTodos.length === todos.length) {
      response.status(404).json({ error: "Todo not found." });
      return;
    }

    await writeTodos(filteredTodos);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: "Something went wrong." });
});

app.listen(PORT, HOST, () => {
  console.log(`Todo API running on http://${HOST}:${PORT}`);
});
