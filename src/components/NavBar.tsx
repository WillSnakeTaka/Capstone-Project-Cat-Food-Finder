import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { selectCartCount } from "../features/cart/cartSlice";

export default function NavBar() {
  const { user, logout } = useAuth();
  const cartCount = useSelector(selectCartCount);

  return (
    <header className="top-nav">
      <Link className="brand" to="/">CatCart</Link>
      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/shop">Shop</NavLink>
        <NavLink to="/cart">Cart ({cartCount})</NavLink>
        <NavLink to="/about">About</NavLink>
        {user?.role === "seller" && <NavLink to="/dashboard">Seller Dashboard</NavLink>}
        {!user ? <NavLink to="/auth">Login</NavLink> : <button className="ghost-btn" onClick={logout} type="button">Logout</button>}
      </nav>
    </header>
  );
}
