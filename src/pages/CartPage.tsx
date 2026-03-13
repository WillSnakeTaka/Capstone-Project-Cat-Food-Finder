import { useDispatch, useSelector } from "react-redux";
import { clearServerCart, removeCartItem as removeCartItemRequest, updateCartItem as updateCartItemRequest } from "../api/cartApi";
import { AppDispatch, RootState } from "../app/store";
import CatPhotoBanner from "../components/CatPhotoBanner";
import { clearCart, removeFromCart, replaceCart, selectCartTotal, setQuantity } from "../features/cart/cartSlice";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const items = useSelector((state: RootState) => state.cart.items);
  const total = useSelector(selectCartTotal);

  async function handleClearCart() {
    if (user) {
      const data = await clearServerCart();
      dispatch(replaceCart(data.items));
      return;
    }

    dispatch(clearCart());
  }

  async function handleQuantityChange(productId: string, itemId: string | undefined, quantity: number) {
    if (user && itemId) {
      const data = await updateCartItemRequest(itemId, quantity);
      dispatch(replaceCart(data.items));
      return;
    }

    dispatch(setQuantity({ productId, quantity }));
  }

  async function handleRemove(productId: string, itemId?: string) {
    if (user && itemId) {
      const data = await removeCartItemRequest(itemId);
      dispatch(replaceCart(data.items));
      return;
    }

    dispatch(removeFromCart(productId));
  }

  return (
    <section className="page-stack">
      <CatPhotoBanner
        title="Your CatCart basket"
        subtitle="Adjust quantities, keep favorites, and get your cat's next meal plan organized."
        tone="gold"
      />
      <div className="row-between page-header">
        <h1>Your Cart</h1>
        {items.length > 0 && <button className="ghost-btn" onClick={() => void handleClearCart()}>Clear Cart</button>}
      </div>

      {!items.length ? (
        <p className="status-card">Your cart is empty. Add items from shop.</p>
      ) : (
        <div className="form-grid">
          {items.map((item) => (
            <article className="card" key={item.productId}>
              <div className="row-between">
                <strong>{item.title}</strong>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              <div className="row">
                <label>Qty
                  <input type="number" min={1} value={item.quantity} onChange={(e) => void handleQuantityChange(item.productId, item.id, Number(e.target.value))} />
                </label>
                <button className="danger-btn" onClick={() => void handleRemove(item.productId, item.id)}>Remove</button>
              </div>
            </article>
          ))}
          <div className="card"><h2>Total: ${total.toFixed(2)}</h2></div>
        </div>
      )}
    </section>
  );
}
