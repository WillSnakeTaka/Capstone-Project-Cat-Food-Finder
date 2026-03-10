import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { clearCart, removeFromCart, selectCartTotal, setQuantity } from "../features/cart/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);
  const total = useSelector(selectCartTotal);

  return (
    <section>
      <div className="row-between page-header">
        <h1>Your Cart</h1>
        {items.length > 0 && <button className="ghost-btn" onClick={() => dispatch(clearCart())}>Clear Cart</button>}
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
                  <input type="number" min={1} value={item.quantity} onChange={(e) => dispatch(setQuantity({ productId: item.productId, quantity: Number(e.target.value) }))} />
                </label>
                <button className="danger-btn" onClick={() => dispatch(removeFromCart(item.productId))}>Remove</button>
              </div>
            </article>
          ))}
          <div className="card"><h2>Total: ${total.toFixed(2)}</h2></div>
        </div>
      )}
    </section>
  );
}
