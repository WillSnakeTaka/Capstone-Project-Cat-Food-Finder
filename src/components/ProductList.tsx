import { Link } from "react-router-dom";
import { Product } from "../types";
import { useState } from "react";

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
  items: Array<Product & { canDelete?: boolean }>;
  mode?: "shop" | "seller";
  onEdit?: (item: Product) => void;
  onDelete?: (id: string) => void;
  onAddToCart?: (item: Product) => void;
}) {
  if (!items.length) return <p className="status-card">No products found.</p>;

  return (
    <div className="list-grid">
      {items.map((item) => (
        <ProductCard 
          key={item.id}
          item={item}
          mode={mode}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

function ProductCard({
  item,
  mode,
  onEdit,
  onDelete,
  onAddToCart,
}: {
  item: Product & { canDelete?: boolean };
  mode: "shop" | "seller";
  onEdit?: (item: Product) => void;
  onDelete?: (id: string) => void;
  onAddToCart?: (item: Product) => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const getFallbackImage = () => {
    const colors = {
      wet: "linear-gradient(135deg, #ffd4b3, #ffc8b8)",
      dry: "linear-gradient(135deg, #fff4d1, #ffefc8)",
      treat: "linear-gradient(135deg, #d1f5e8, #c8f0e7)",
      supplement: "linear-gradient(135deg, #e9e4ff, #ede8ff)",
    };
    return colors[item.category as keyof typeof colors] || colors.wet;
  };

  return (
    <article className="card product-card">
      <Link to={`/product/${item.id}`} className="product-image-link">
        {item.imageUrl && !imageFailed ? (
          <img 
            className="product-image" 
            src={item.imageUrl} 
            alt={item.title}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div 
            className="product-image placeholder"
            style={{ background: getFallbackImage(), display: "grid", placeItems: "center" }}
          >
            <div style={{ textAlign: "center", color: "rgba(0,0,0,0.3)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>
                {item.category === "wet" && "🍲"}
                {item.category === "dry" && "🌾"}
                {item.category === "treat" && "🍖"}
                {item.category === "supplement" && "💊"}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: "600" }}>Cute cat card</div>
            </div>
          </div>
        )}
      </Link>
      <div className="row-between">
        <Link to={`/product/${item.id}`} className="product-title-link">
          <h3>{item.title}</h3>
        </Link>
        <span className={`pill ${item.category}`}>{item.category}</span>
      </div>
      <p><strong>Brand:</strong> {item.brand}</p>
      <p><strong>Rating:</strong> {Number(item.rating || 0).toFixed(1)} / 5</p>
      <p><strong>In Stock:</strong> {item.stock}</p>
      <p className="price-tag">{formatPrice(item.price)}</p>
      <p>{item.description || "No description provided."}</p>
      <div className="row">
        {mode === "shop" && onAddToCart && <button type="button" onClick={() => onAddToCart(item)}>Add to Cart</button>}
        {mode === "seller" && onEdit && <button type="button" onClick={() => onEdit(item)}>Edit</button>}
        {onDelete && (mode === "seller" || item.canDelete) && (
          <button className="danger-btn" type="button" onClick={() => onDelete(item.id)}>Delete</button>
        )}
      </div>
    </article>
  );
}
