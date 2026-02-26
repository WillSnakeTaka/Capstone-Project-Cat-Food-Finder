import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="hero card">
      <p className="eyebrow">Portfolio Project</p>
      <h1>Track your cat food inventory with secure auth and clean CRUD.</h1>
      <p>
        Built with React + Supabase Auth + Postgres + RLS. Add, edit, and filter wet/dry food with
        optional FDA recall checks.
      </p>
      <div className="row">
        <Link className="btn-link" to="/dashboard">
          Open Dashboard
        </Link>
        <Link className="btn-link ghost" to="/about">
          Learn More
        </Link>
      </div>
    </section>
  );
}
