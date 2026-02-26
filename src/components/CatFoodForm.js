import { useEffect, useState } from "react";

const initialState = {
  name: "",
  type: "wet",
  brand: "",
  size: "",
  description: "",
};

export default function CatFoodForm({ onSubmit, editingItem, onCancel }) {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setForm({
        name: editingItem.name || "",
        type: editingItem.type || "wet",
        brand: editingItem.brand || "",
        size: editingItem.size || "",
        description: editingItem.description || "",
      });
    } else {
      setForm(initialState);
    }
  }, [editingItem]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
      if (!editingItem) setForm(initialState);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h2>{editingItem ? "Edit Cat Food" : "Add Cat Food"}</h2>
      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Type
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="wet">Wet</option>
          <option value="dry">Dry</option>
        </select>
      </label>
      <label>
        Brand
        <input name="brand" value={form.brand} onChange={handleChange} required />
      </label>
      <label>
        Size
        <input name="size" value={form.size} onChange={handleChange} placeholder="3 lb, 24 cans" />
      </label>
      <label>
        Description
        <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
      </label>
      <div className="row">
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : editingItem ? "Update" : "Create"}
        </button>
        {editingItem && (
          <button className="ghost-btn" type="button" onClick={onCancel}>
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}
