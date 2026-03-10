import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { getMe, login as loginRequest, register as registerRequest } from "../api/authApi";
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

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
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    hydrateUser();
  }, []);

  async function login(email: string, password: string) {
    const data = await loginRequest({ email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(input: { name: string; email: string; password: string; role: UserRole }) {
    const data = await registerRequest(input);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
