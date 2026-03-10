import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import ProductList from "../components/ProductList";
import { deleteProduct, listProducts } from "../api/productsApi";
import { findRecallMatches } from "../api/recallsApi";
import { useAuth } from "../context/AuthContext";
import { addToCart } from "../features/cart/cartSlice";
import { AppDispatch } from "../app/store";
import { Product } from "../types";

export default function ShopPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [filters, setFilters] = useState({ q: "", category: "all", sort: "newest", minPrice: "", maxPrice: "" });
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recallSet, setRecallSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const data = await listProducts(filters);
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load products");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [filters]);

  useEffect(() => {
    async function loadRecalls() {
      try {
        const names = items.map((item) => item.title);
        setRecallSet(await findRecallMatches(names));
      } catch {
        setRecallSet(new Set());
      }
    }
    loadRecalls();
  }, [items]);

  async function handleDelete(id: string) {
    try {
      await deleteProduct(id);
      setItems(await listProducts(filters));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const hydratedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        recallMatch: recallSet.has(item.title.toLowerCase()),
        canDelete: user?.role === "seller" && user.id === item.seller,
      })),
    [items, recallSet, user]
  );

  return (
    <section>
      <div className="card filter-panel">
        <h1>Shop Cat Food</h1>
        <div className="filter-grid">
          <label>Search<input name="q" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} placeholder="Search title/brand" /></label>
          <label>Category<select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}><option value="all">All</option><option value="wet">Wet</option><option value="dry">Dry</option><option value="treat">Treat</option><option value="supplement">Supplement</option></select></label>
          <label>Sort by<select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}><option value="newest">Newest</option><option value="rating">Top Rated</option><option value="priceAsc">Price: Low to High</option><option value="priceDesc">Price: High to Low</option></select></label>
          <label>Min price<input type="number" min="0" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} /></label>
          <label>Max price<input type="number" min="0" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} /></label>
        </div>
      </div>

      {loading ? <p className="status-card">Loading products...</p> : <ProductList items={hydratedItems} mode="shop" onDelete={handleDelete} onAddToCart={(item) => dispatch(addToCart(item))} />}
      {error && <p className="error-text">{error}</p>}
    </section>
  );
}
