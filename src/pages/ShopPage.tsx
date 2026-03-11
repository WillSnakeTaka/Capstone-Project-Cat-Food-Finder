import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import ProductList from "../components/ProductList";
import CatPhotoBanner from "../components/CatPhotoBanner";
import { deleteProduct, listProducts } from "../api/productsApi";
import { useAuth } from "../context/AuthContext";
import { addToCart } from "../features/cart/cartSlice";
import { AppDispatch } from "../app/store";
import { Product } from "../types";

const CATEGORIES = [
  { value: "all", label: "All Products" },
  { value: "wet", label: "Wet Food" },
  { value: "dry", label: "Dry Food" },
  { value: "treat", label: "Treats" },
  { value: "supplement", label: "Supplements" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "rating", label: "Top Rated" },
  { value: "priceAsc", label: "Price: Low to High" },
  { value: "priceDesc", label: "Price: High to Low" },
];

export default function ShopPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [filters, setFilters] = useState({ q: "", category: "all", sort: "rating", minPrice: "", maxPrice: "" });
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        canDelete: user?.role === "seller" && user.id === item.seller,
      })),
    [items, user]
  );

  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    CATEGORIES.forEach((cat) => {
      if (cat.value !== "all") {
        grouped[cat.value] = items.filter((p) => p.category === cat.value).slice(0, 4);
      }
    });
    return grouped;
  }, [items]);

  return (
    <section>
      <CatPhotoBanner
        title="Cat food picks sorted by stars, price, and freshness."
        subtitle="Every product image now uses cat-food artwork instead of unrelated random scenery."
        tone="gold"
      />

      <div className="card filter-panel">
        <h2>Find Your Cat's Favorite</h2>
        <div className="filter-grid">
          <label>
            Search
            <input
              name="q"
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              placeholder="Search title/brand..."
            />
          </label>
          <label>
            Category
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sort by
            <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Min price
            <input
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
          </label>
          <label>
            Max price
            <input
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </label>
        </div>
      </div>

      {filters.q || filters.category !== "all" || filters.minPrice || filters.maxPrice ? (
        <div>
          <h2 className="section-title">Search Results</h2>
          {loading ? (
            <p className="status-card">Loading products...</p>
          ) : (
            <>
              <ProductList items={hydratedItems} mode="shop" onDelete={handleDelete} onAddToCart={(item) => dispatch(addToCart(item))} />
              {hydratedItems.length === 0 && <p className="status-card">No products match your criteria.</p>}
            </>
          )}
          {error && <p className="error-text">{error}</p>}
        </div>
      ) : (
        <div className="featured-sections">
          {CATEGORIES.filter((c) => c.value !== "all").map((category) => {
            const categoryProducts = productsByCategory[category.value] || [];
            if (categoryProducts.length === 0) return null;

            return (
              <div key={category.value} className="featured-section">
                <div className="section-header">
                  <h2>{category.label}</h2>
                  <button className="ghost-btn small" onClick={() => setFilters({ ...filters, category: category.value })}>
                    View All →
                  </button>
                </div>
                <ProductList items={categoryProducts} mode="shop" onDelete={handleDelete} onAddToCart={(item) => dispatch(addToCart(item))} />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
