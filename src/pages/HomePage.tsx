import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="hero card">
      <p className="eyebrow">CatCart Marketplace</p>
      <h1>Amazon-style cat food shopping app with typed React + API backend.</h1>
      <p>Browse products, rank by stars/price/newest, add to cart, and manage seller inventory.</p>
      <div className="row">
        <Link className="btn-link" to="/shop">Start Shopping</Link>
        <Link className="btn-link ghost" to="/auth">Create Account</Link>
      </div>
    </section>
  );
}
