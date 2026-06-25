# Ziptrrip Todo App Features

## Frontend

- Multi-page React application
- `client/index.html` renders the todo list page
- `client/todo.html` renders the single todo detail page
- Todo list page supports:
  - create a new todo
  - search todos by title or description
  - filter todos by status (all, active, completed)
  - sort todos by created date, due date, or priority
  - toggle todo completion from the list
  - open a todo detail page by clicking `Open`
- Todo detail page supports:
  - read todo by `id` from query string, e.g. `todo.html?id=todo-1`
  - display title, description, priority, due date, created/updated timestamps
  - edit the todo in place
  - delete the todo
  - toggle completion state
  - back navigation to the todo list page

## Backend

- Node.js + Express REST API
- File-based persistence using `server/data/todos.json`
- CRUD endpoints:
  - `GET /api/todos` — list todos with query filters
  - `GET /api/todos/:id` — get a single todo
  - `POST /api/todos` — create a new todo
  - `PUT /api/todos/:id` — update an existing todo
  - `DELETE /api/todos/:id` — delete a todo
- Filtering and sorting in list endpoint:
  - `search` query parameter searches `title` and `description`
  - `status=active|completed|all`
  - `sort=createdAt|dueDate|priority`
- Validation rules for todos:
  - required `title`
  - optional `description`
  - optional `dueDate`, must be valid date if provided
  - `priority` must be `low`, `medium`, or `high`

## Documentation

- `README.md` includes installation and run instructions
- `docs/FEATURES.md` lists supported app features
- `docs/API.md` describes available backend endpoints and request format
