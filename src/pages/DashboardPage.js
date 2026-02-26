import { useCallback, useEffect, useMemo, useState } from "react";
import CatFoodForm from "../components/CatFoodForm";
import CatFoodList from "../components/CatFoodList";
import { createCatFood, deleteCatFood, listCatFoods, updateCatFood } from "../api/catfoodsApi";
import { fetchRecallMatchesByNames } from "../api/fdaApi";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recallMatches, setRecallMatches] = useState(new Set());

  const loadItems = useCallback(async (activeFilter) => {
    setLoading(true);
    setError("");
    try {
      const data = await listCatFoods(activeFilter);
      setItems(data);
    } catch (err) {
      setError(err.message || "Unable to load cat foods.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems(filter);
  }, [filter, loadItems]);

  useEffect(() => {
    async function loadRecalls() {
      const names = items.map((item) => item.name);
      const matched = await fetchRecallMatchesByNames(names);
      setRecallMatches(matched);
    }

    loadRecalls();
  }, [items]);

  async function handleSubmit(formData) {
    setError("");
    const payload = { ...formData, user_id: user.id };

    try {
      if (editingItem) {
        await updateCatFood(editingItem.id, payload);
        setEditingItem(null);
      } else {
        await createCatFood(payload);
      }
      await loadItems(filter);
    } catch (err) {
      setError(err.message || "Save failed.");
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteCatFood(id);
      await loadItems(filter);
      if (editingItem?.id === id) setEditingItem(null);
    } catch (err) {
      setError(err.message || "Delete failed.");
    }
  }

  const title = useMemo(() => {
    if (filter === "wet") return "Wet Food";
    if (filter === "dry") return "Dry Food";
    return "All Cat Food";
  }, [filter]);

  return (
    <section>
      <div className="row-between page-header">
        <h1>Dashboard</h1>
        <div className="row filter-row">
          <span>Filter:</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="wet">Wet</option>
            <option value="dry">Dry</option>
          </select>
        </div>
      </div>

      <CatFoodForm onSubmit={handleSubmit} editingItem={editingItem} onCancel={() => setEditingItem(null)} />

      <h2 className="section-title">{title}</h2>
      {loading ? (
        <p className="status-card">Loading cat foods...</p>
      ) : (
        <CatFoodList
          items={items}
          onEdit={setEditingItem}
          onDelete={handleDelete}
          recallMatches={recallMatches}
        />
      )}

      {error && <p className="error-text">{error}</p>}
    </section>
  );
}
