import { apiFetch } from "./http";

export function fetchCatFacts() {
  return apiFetch<{ facts: string[] }>("/cat-health/facts");
}

export function fetchCatImage() {
  return apiFetch<{ imageUrl: string }>("/cat-health/image");
}
