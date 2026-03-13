import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Product } from "../types";
import { addCartItem as addCartItemRequest } from "../api/cartApi";
import { getProduct } from "../api/productsApi";
import { addToCart, replaceCart } from "../features/cart/cartSlice";
import { AppDispatch } from "../app/store";
import CatPhotoBanner from "../components/CatPhotoBanner";
import { useAuth } from "../context/AuthContext";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError("");
      try {
        setProduct(await getProduct(id as string));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load product");
      } finally {
        setLoading(false);
      }
    }

    if (id) loadProduct();
  }, [id]);

  function handleAddToCart() {
    if (!product) return;
    (async () => {
      if (user) {
        const data = await addCartItemRequest(product.id, quantity);
        dispatch(replaceCart(data.items));
      } else {
        for (let i = 0; i < quantity; i += 1) {
          dispatch(addToCart(product));
        }
      }

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    })().catch((err) => {
      setError(err instanceof Error ? err.message : "Unable to add to cart");
    });
  }

  if (loading) return <p className="status-card">Loading product details...</p>;
  if (error || !product) return <p className="error-text">{error || "Product not found"}</p>;

  return (
    <section className="page-stack">
      <CatPhotoBanner
        title={product.title}
        subtitle="Single-product view with cart actions, stock details, and cat-first styling."
      />
      <Link className="ghost-btn" to="/shop">← Back to Shop</Link>
      <div className="product-detail">
        <div className="detail-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} />
          ) : (
            <div className="placeholder">No Image Available</div>
          )}
        </div>

        <div className="detail-info">
          <h1>{product.title}</h1>
          <div className="detail-meta">
            <span className={`pill ${product.category}`}>{product.category}</span>
            <span className="rating">★ {Number(product.rating || 0).toFixed(1)} / 5</span>
          </div>

          <p className="price-large">{formatPrice(product.price)}</p>

          <div className="detail-specs">
            <p><strong>Brand:</strong> {product.brand}</p>
            {product.size && <p><strong>Size:</strong> {product.size}</p>}
            <p><strong>In Stock:</strong> {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>
          </div>

          {product.description && (
            <div className="detail-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          {product.stock > 0 ? (
            <div className="detail-actions">
              <div className="qty-picker">
                <label htmlFor="qty">Quantity:</label>
                <input
                  id="qty"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
              <button className="primary-btn" onClick={handleAddToCart}>
                {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
              </button>
            </div>
          ) : (
            <p className="error-text">This product is currently out of stock</p>
          )}
        </div>
      </div>
    </section>
  );
}
