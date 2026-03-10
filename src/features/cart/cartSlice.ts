import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, Product } from "../../types";
import { RootState } from "../../app/store";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const existing = state.items.find((item) => item.productId === product.id);
      if (existing) {
        existing.quantity += 1;
        return;
      }

      state.items.push({
        productId: product.id,
        title: product.title,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity: 1,
      });
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    setQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find((entry) => entry.productId === action.payload.productId);
      if (!item) return;
      item.quantity = Math.max(1, action.payload.quantity);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, setQuantity, clearCart } = cartSlice.actions;
export const selectCartCount = (state: RootState) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state: RootState) => state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export default cartSlice.reducer;
