import { Product } from "../types";
import { apiFetch } from "./http";

function queryFrom(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") searchParams.set(key, String(value));
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export function listProducts(filters: Record<string, string | number | undefined> = {}) {
  return apiFetch<Product[]>(`/products${queryFrom(filters)}`);
}

export function listMyProducts() {
  return apiFetch<Product[]>("/products/mine");
}

export function getProduct(id: string) {
  return apiFetch<Product>(`/products/${id}`);
}

export function createProduct(payload: Partial<Product>) {
  return apiFetch<Product>("/products", { method: "POST", body: JSON.stringify(payload) });
}

export function updateProduct(id: string, payload: Partial<Product>) {
  return apiFetch<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

export function deleteProduct(id: string) {
  return apiFetch<null>(`/products/${id}`, { method: "DELETE" });
}
