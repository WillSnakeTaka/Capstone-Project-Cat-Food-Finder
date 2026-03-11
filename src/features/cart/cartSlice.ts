import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, Product } from "../../types";
import { RootState } from "../../app/store";

interface CartState {
  items: CartItem[];
}

const storedCart = localStorage.getItem("cart");
const initialState: CartState = storedCart ? JSON.parse(storedCart) : { items: [] };

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
      localStorage.setItem("cart", JSON.stringify(state));
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state));
    },
    setQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find((entry) => entry.productId === action.payload.productId);
      if (!item) return;
      item.quantity = Math.max(1, action.payload.quantity);
      localStorage.setItem("cart", JSON.stringify(state));
    },
    clearCart(state) {
      state.items = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const { addToCart, removeFromCart, setQuantity, clearCart } = cartSlice.actions;
export const selectCartCount = (state: RootState) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state: RootState) => state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export default cartSlice.reducer;
