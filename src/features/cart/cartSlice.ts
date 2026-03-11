import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, Product } from "../../types";
import { RootState } from "../../app/store";

interface CartState {
  items: CartItem[];
}

function normalizeStoredItems(items: unknown): CartItem[] {
  if (!Array.isArray(items)) return [];

  return items
    .filter((item): item is Partial<CartItem> => Boolean(item && typeof item === "object"))
    .map((item) => ({
      productId: String(item.productId || ""),
      title: String(item.title || "Cat food"),
      imageUrl: item.imageUrl ? String(item.imageUrl) : "",
      price: Number(item.price || 0),
      quantity: Math.max(1, Number(item.quantity || 1)),
    }))
    .filter((item) => item.productId);
}

function readStoredCart(): CartState {
  const raw =
    localStorage.getItem("catcart-cart") ||
    localStorage.getItem("cart") ||
    localStorage.getItem("cartItems");

  if (!raw) return { items: [] };

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return { items: normalizeStoredItems(parsed) };
    }

    if (parsed && typeof parsed === "object" && "items" in parsed) {
      return { items: normalizeStoredItems((parsed as { items?: unknown }).items) };
    }
  } catch {
    return { items: [] };
  }

  return { items: [] };
}

function persistCart(items: CartItem[]) {
  const payload = JSON.stringify({ items });
  localStorage.setItem("cart", payload);
  localStorage.setItem("catcart-cart", payload);
}

const initialState: CartState = readStoredCart();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const existing = state.items.find((item) => item.productId === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          productId: product.id,
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity: 1,
        });
      }
      persistCart(state.items);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      persistCart(state.items);
    },
    setQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find((entry) => entry.productId === action.payload.productId);
      if (!item) return;
      item.quantity = Math.max(1, action.payload.quantity);
      persistCart(state.items);
    },
    clearCart(state) {
      state.items = [];
      persistCart(state.items);
    },
  },
});

export const { addToCart, removeFromCart, setQuantity, clearCart } = cartSlice.actions;
export const selectCartCount = (state: RootState) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state: RootState) => state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export default cartSlice.reducer;
