import { AuthUser } from "../types";
import { apiFetch } from "./http";

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export function register(payload: { name: string; email: string; password: string; role: "buyer" | "seller" }) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: { email: string; password: string }) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMe() {
  return apiFetch<{ user: AuthUser }>("/auth/me");
}
