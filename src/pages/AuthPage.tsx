import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";

export default function AuthPage() {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user) return <Navigate to={user.role === "seller" ? "/dashboard" : "/shop"} replace />;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "signup") await register({ name, email, password, role });
      else await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card auth-wrap">
      <h1>{mode === "signup" ? "Create Account" : "Login"}</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        {mode === "signup" && <label>Full name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>}
        {mode === "signup" && <label>Account type<select value={role} onChange={(e) => setRole(e.target.value as UserRole)}><option value="buyer">Buyer</option><option value="seller">Seller</option></select></label>}
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required /></label>
        <button type="submit" disabled={loading}>{loading ? "Working..." : mode === "signup" ? "Sign Up" : "Login"}</button>
      </form>
      {error && <p className="error-text">{error}</p>}
      <button type="button" className="ghost-btn" onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}>
        {mode === "login" ? "Need an account? Sign up" : "Already have an account? Login"}
      </button>
    </section>
  );
}
