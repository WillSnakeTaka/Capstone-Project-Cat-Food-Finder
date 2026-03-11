import CatPhotoBanner from "../components/CatPhotoBanner";

export default function AboutPage() {
  return (
    <section className="page-stack">
      <CatPhotoBanner
        title="About CatCart"
        subtitle="A cat-only marketplace project with shopping, community pages, and simple full-stack structure."
        tone="mint"
      />

      <section className="hero-grid">
        <article className="card prose">
          <h2>Frontend</h2>
          <ul>
            <li>TypeScript React pages with Router and Redux cart state</li>
            <li>Reusable cat-photo banners and cute storefront cards</li>
            <li>Quiz, rescue board, expert guide, and musician feed</li>
          </ul>
        </article>

        <article className="card prose">
          <h2>Backend</h2>
          <ul>
            <li>Express API with JWT auth</li>
            <li>Simple JSON fake DB for easy local setup and demos</li>
            <li>Product CRUD, community posts, and cat-health API proxy routes</li>
          </ul>
        </article>
      </section>
    </section>
  );
}
