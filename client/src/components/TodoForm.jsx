import { useState } from "react";

const emptyTodo = {
  title: "",
  description: "",
  completed: false,
  priority: "medium",
  dueDate: ""
};

export default function TodoForm({ initialTodo = emptyTodo, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    ...emptyTodo,
    ...initialTodo
  });
  const [isSaving, setIsSaving] = useState(false);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await onSubmit(form);
      if (!initialTodo.id) {
        setForm(emptyTodo);
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        Title
        <input
          name="title"
          value={form.title}
          onChange={updateField}
          placeholder="Write the task title"
          required
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={updateField}
          placeholder="Add notes, acceptance details, or links"
        />
      </label>

      <label>
        Priority
        <select name="priority" value={form.priority} onChange={updateField}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <label>
        Due date
        <input name="dueDate" type="date" value={form.dueDate} onChange={updateField} />
      </label>

      <label>
        <span>
          <input
            className="checkbox"
            name="completed"
            type="checkbox"
            checked={form.completed}
            onChange={updateField}
          />{" "}
          Completed
        </span>
      </label>

      <div className="button-row">
        <button className="button" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button className="button secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
