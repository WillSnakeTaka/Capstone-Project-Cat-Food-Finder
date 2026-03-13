import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe, login as loginRequest, register as registerRequest } from "../api/authApi";
import { addCartItem as addCartItemRequest, fetchCart } from "../api/cartApi";
import { AppDispatch, RootState } from "../app/store";
import { replaceCart } from "../features/cart/cartSlice";
import { AuthUser, UserRole } from "../types";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: { name: string; email: string; password: string; role: UserRole }) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const syncCartFromServer = useCallback(async () => {
    const data = await fetchCart();
    dispatch(replaceCart(data.items));
  }, [dispatch]);

  const mergeGuestCartIntoServer = useCallback(async () => {
    if (!cartItems.length) {
      await syncCartFromServer();
      return;
    }

    for (const item of cartItems) {
      await addCartItemRequest(item.productId, item.quantity);
    }

    await syncCartFromServer();
  }, [cartItems, syncCartFromServer]);

  useEffect(() => {
    async function hydrateUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMe();
        setUser(data.user);
        await syncCartFromServer();
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    hydrateUser();
  }, [syncCartFromServer]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginRequest({ email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    await mergeGuestCartIntoServer();
    return data.user;
  }, [mergeGuestCartIntoServer]);

  const register = useCallback(async (input: { name: string; email: string; password: string; role: UserRole }) => {
    const data = await registerRequest(input);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    await mergeGuestCartIntoServer();
    return data.user;
  }, [mergeGuestCartIntoServer]);

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
