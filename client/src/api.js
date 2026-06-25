const JSON_HEADERS = {
  "Content-Type": "application/json"
};

async function request(path, options = {}) {
  const response = await fetch(path, options);

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

export function getTodos(params = {}) {
  const query = new URLSearchParams(params);
  return request(`/api/todos?${query.toString()}`);
}

export function getTodo(id) {
  return request(`/api/todos/${id}`);
}

export function createTodo(todo) {
  return request("/api/todos", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(todo)
  });
}

export function updateTodo(id, todo) {
  return request(`/api/todos/${id}`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify(todo)
  });
}

export function deleteTodo(id) {
  return request(`/api/todos/${id}`, {
    method: "DELETE"
  });
}
