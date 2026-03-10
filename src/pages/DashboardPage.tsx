import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import { createProduct, deleteProduct, listMyProducts, updateProduct } from "../api/productsApi";
import { Product } from "../types";

export default function DashboardPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      setItems(await listMyProducts());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleSubmit(formData: Record<string, string>) {
    setError("");
    try {
      if (editingItem) {
        await updateProduct(editingItem.id, formData);
        setEditingItem(null);
      } else {
        await createProduct(formData);
      }
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function handleDelete(id: string) {
    setError("");
    try {
      await deleteProduct(id);
      await loadItems();
      if (editingItem?.id === id) setEditingItem(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <section>
      <h1>Seller Dashboard</h1>
      <ProductForm onSubmit={handleSubmit} editingItem={editingItem} onCancel={() => setEditingItem(null)} />
      <h2 className="section-title">My Listings</h2>
      {loading ? <p className="status-card">Loading your products...</p> : <ProductList items={items} mode="seller" onEdit={setEditingItem} onDelete={handleDelete} />}
      {error && <p className="error-text">{error}</p>}
    </section>
  );
}
