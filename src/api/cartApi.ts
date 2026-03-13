import { CartItem } from "../types";
import { apiFetch } from "./http";

interface CartResponse {
  id?: string;
  items: CartItem[];
  updatedAt?: string;
}

export function fetchCart() {
  return apiFetch<CartResponse>("/cart");
}

export function addCartItem(productId: string, quantity = 1) {
  return apiFetch<CartResponse>("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export function updateCartItem(itemId: string, quantity: number) {
  return apiFetch<CartResponse>(`/cart/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(itemId: string) {
  return apiFetch<CartResponse>(`/cart/items/${itemId}`, {
    method: "DELETE",
  });
}

export function clearServerCart() {
  return apiFetch<CartResponse>("/cart", {
    method: "DELETE",
  });
}
