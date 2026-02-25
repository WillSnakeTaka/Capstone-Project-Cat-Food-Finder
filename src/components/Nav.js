import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="nav">
      <Link to="/" className="brand">
        Crypto Prices
      </Link>
      <Link to="/currencies">Currencies</Link>
    </nav>
  );
}
