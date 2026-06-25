# Ziptrrip Todo App API

## Base URL

When running locally:

```text
http://127.0.0.1:3001/api
```

## Endpoints

### GET /api/todos

List todos.

Query parameters:

- `search` — case-insensitive text search in title and description
- `status` — `all`, `active`, or `completed`
- `sort` — `createdAt`, `dueDate`, or `priority`

Example:

```bash
curl "http://127.0.0.1:3001/api/todos?search=review&status=active&sort=dueDate"
```

Response:

- `200 OK` — array of todo objects

### GET /api/todos/:id

Get a single todo by id.

Example:

```bash
curl "http://127.0.0.1:3001/api/todos/todo-1"
```

Response:

- `200 OK` — todo object
- `404 Not Found` — todo not found

### POST /api/todos

Create a new todo.

Request body:

```json
{
  "title": "New task",
  "description": "Optional details",
  "priority": "high",
  "dueDate": "2026-07-01",
  "completed": false
}
```

Response:

- `201 Created` — created todo object
- `400 Bad Request` — validation error

### PUT /api/todos/:id

Update an existing todo.

Request body may include any todo fields:

```json
{
  "title": "Updated task",
  "completed": true
}
```

Response:

- `200 OK` — updated todo object
- `400 Bad Request` — validation error
- `404 Not Found` — todo not found

### DELETE /api/todos/:id

Delete a todo.

Response:

- `204 No Content` — deleted successfully
- `404 Not Found` — todo not found

## Todo object model

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "completed": true,
  "priority": "low|medium|high",
  "dueDate": "YYYY-MM-DD",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```
