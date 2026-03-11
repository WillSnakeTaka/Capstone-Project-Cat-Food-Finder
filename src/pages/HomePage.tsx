import { Link } from "react-router-dom";
import CatPhotoBanner from "../components/CatPhotoBanner";

export default function HomePage() {
  return (
    <section className="page-stack">
      <CatPhotoBanner
        title="Cute cat shopping with health, rescue, and community extras."
        subtitle="Browse food, find rescue resources, follow cat musicians, and take a cat quiz."
        tone="peach"
      />

      <section className="hero-grid">
        <article className="card">
          <p className="eyebrow">CatCart Marketplace</p>
          <h2>Shop cat-only food and wellness picks.</h2>
          <p>Use ranking filters, detailed product pages, and a simple cart flow designed for presentation and demo use.</p>
          <div className="row">
            <Link className="btn-link" to="/shop">Shop Cat Food</Link>
            <Link className="btn-link ghost" to="/expert">Cat Health Hub</Link>
          </div>
        </article>

        <article className="card">
          <p className="eyebrow">Community</p>
          <h2>Help cats beyond the cart.</h2>
          <p>Report homeless cats, browse rescue tips, post musician updates, and give visitors more to explore.</p>
          <div className="row">
            <Link className="btn-link" to="/rescue">Rescue Board</Link>
            <Link className="btn-link ghost" to="/musicians">Cat Musicians</Link>
            <Link className="btn-link ghost" to="/quiz">Cat Quiz</Link>
          </div>
        </article>
      </section>
    </section>
  );
}
