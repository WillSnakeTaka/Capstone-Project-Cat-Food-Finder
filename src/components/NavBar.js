import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

export default function NavBar() {
  const { user } = useAuth();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
  }

  return (
    <header className="top-nav">
      <Link className="brand" to="/">
        Cat Food Tracker
      </Link>
      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        {user && <NavLink to="/dashboard">Dashboard</NavLink>}
        {!user ? (
          <NavLink to="/auth">Login</NavLink>
        ) : (
          <button className="ghost-btn" onClick={handleLogout} type="button">
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
