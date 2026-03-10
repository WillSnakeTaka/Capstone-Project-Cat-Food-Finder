import { Product } from "../types";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);
}

export default function ProductList({
  items,
  mode = "shop",
  onEdit,
  onDelete,
  onAddToCart,
}: {
  items: Array<Product & { recallMatch?: boolean; canDelete?: boolean }>;
  mode?: "shop" | "seller";
  onEdit?: (item: Product) => void;
  onDelete?: (id: string) => void;
  onAddToCart?: (item: Product) => void;
}) {
  if (!items.length) return <p className="status-card">No products found.</p>;

  return (
    <div className="list-grid">
      {items.map((item) => (
        <article className="card product-card" key={item.id}>
          {item.imageUrl ? <img className="product-image" src={item.imageUrl} alt={item.title} /> : <div className="product-image placeholder">No Image</div>}
          <div className="row-between">
            <h3>{item.title}</h3>
            <span className={`pill ${item.category}`}>{item.category}</span>
          </div>
          <p><strong>Brand:</strong> {item.brand}</p>
          <p><strong>Rating:</strong> {Number(item.rating || 0).toFixed(1)} / 5</p>
          <p><strong>In Stock:</strong> {item.stock}</p>
          <p className="price-tag">{formatPrice(item.price)}</p>
          <p>{item.description || "No description provided."}</p>
          {item.recallMatch && <span className="recall-badge">Possible Recall Match</span>}

          <div className="row">
            {mode === "shop" && onAddToCart && <button type="button" onClick={() => onAddToCart(item)}>Add to Cart</button>}
            {mode === "seller" && onEdit && <button type="button" onClick={() => onEdit(item)}>Edit</button>}
            {onDelete && (mode === "seller" || item.canDelete) && (
              <button className="danger-btn" type="button" onClick={() => onDelete(item.id)}>Delete</button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
