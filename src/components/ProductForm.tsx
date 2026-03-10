import { useEffect, useState } from "react";
import { Product } from "../types";

const initialState = {
  title: "",
  category: "wet",
  brand: "",
  size: "",
  description: "",
  imageUrl: "",
  price: "",
  rating: "4",
  stock: "0",
};

type FormState = typeof initialState;

export default function ProductForm({
  onSubmit,
  editingItem,
  onCancel,
}: {
  onSubmit: (data: FormState) => Promise<void>;
  editingItem: Product | null;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!editingItem) {
      setForm(initialState);
      return;
    }

    setForm({
      title: editingItem.title || "",
      category: editingItem.category || "wet",
      brand: editingItem.brand || "",
      size: editingItem.size || "",
      description: editingItem.description || "",
      imageUrl: editingItem.imageUrl || "",
      price: String(editingItem.price ?? ""),
      rating: String(editingItem.rating ?? "4"),
      stock: String(editingItem.stock ?? "0"),
    });
  }, [editingItem]);

  async function handleSubmit(event: React.FormEvent) {
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
      <h2>{editingItem ? "Edit Listing" : "Add Listing"}</h2>
      <label>Product title<input name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
      <label>Category
        <select name="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as FormState["category"] })}>
          <option value="wet">Wet</option><option value="dry">Dry</option><option value="treat">Treat</option><option value="supplement">Supplement</option>
        </select>
      </label>
      <label>Brand<input name="brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required /></label>
      <label>Size<input name="size" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} /></label>
      <label>Price<input name="price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></label>
      <label>Rating<input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></label>
      <label>Stock<input name="stock" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></label>
      <label>Image URL<input name="imageUrl" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></label>
      <label>Description<textarea name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></label>
      <div className="row">
        <button type="submit" disabled={submitting}>{submitting ? "Saving..." : editingItem ? "Update" : "Create"}</button>
        {editingItem && <button className="ghost-btn" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
