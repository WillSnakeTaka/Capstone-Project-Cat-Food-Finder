import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

export default function AuthPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        setMessage("Account created. Check your email if confirmation is enabled.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
    } catch (err) {
      setError(err.message || "Auth request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card auth-wrap">
      <h1>{mode === "signup" ? "Create Account" : "Login"}</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Working..." : mode === "signup" ? "Sign Up" : "Login"}
        </button>
      </form>
      {message && <p className="ok-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}
      <button
        type="button"
        className="ghost-btn"
        onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
      >
        {mode === "login" ? "Need an account? Sign up" : "Already have an account? Login"}
      </button>
    </section>
  );
}
