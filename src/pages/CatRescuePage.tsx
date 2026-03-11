import { useEffect, useState } from "react";
import { createRescueReport, listRescueReports } from "../api/communityApi";
import CatPhotoBanner from "../components/CatPhotoBanner";
import { RescueReport } from "../types";

const initialForm = {
  catName: "",
  city: "",
  contactName: "",
  contactInfo: "",
  description: "",
  status: "needs foster",
};

export default function CatRescuePage() {
  const [reports, setReports] = useState<RescueReport[]>([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      setReports(await listRescueReports());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load rescue reports.");
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await createRescueReport(form);
      setForm(initialForm);
      await loadReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to post rescue report.");
    }
  }

  return (
    <section className="page-stack">
      <CatPhotoBanner
        title="Cat Adoption and Rescue"
        subtitle="Report homeless cats, share safe rescue details, and connect neighbors with adoption leads."
        tone="mint"
      />

      <div className="community-grid">
        <article className="card">
          <h2>Rescue Tips</h2>
          <ul className="info-list">
            <li>Use food and calm body language before trying to approach a stray cat.</li>
            <li>Check for collars, ear tips, and neighborhood feeders before relocating a cat.</li>
            <li>Post clear location details and temperament notes so rescuers can act safely.</li>
            <li>Contact local humane societies, TNR groups, and no-kill rescues first.</li>
          </ul>
        </article>

        <article className="card">
          <h2>Trusted Rescue and Search Links</h2>
          <ul className="link-list">
            <li><a href="https://www.petfinder.com/" target="_blank" rel="noreferrer">Petfinder</a></li>
            <li><a href="https://bestfriends.org/" target="_blank" rel="noreferrer">Best Friends Animal Society</a></li>
            <li><a href="https://www.adoptapet.com/" target="_blank" rel="noreferrer">Adopt-a-Pet</a></li>
            <li><a href="https://www.alleycat.org/" target="_blank" rel="noreferrer">Alley Cat Allies</a></li>
            <li><a href="https://petcolove.org/lost/" target="_blank" rel="noreferrer">Petco Love Lost</a></li>
            <li><a href="https://www.pawboost.com/" target="_blank" rel="noreferrer">PawBoost</a></li>
          </ul>
        </article>
      </div>

      <div className="community-grid community-grid-wide">
        <form className="card form-grid" onSubmit={handleSubmit}>
          <h2>Report a Homeless Cat</h2>
          <label>
            Cat nickname
            <input value={form.catName} onChange={(e) => setForm({ ...form, catName: e.target.value })} placeholder="Tabby near the park" />
          </label>
          <label>
            City / area
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
          </label>
          <label>
            Contact name
            <input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} required />
          </label>
          <label>
            Contact info
            <input value={form.contactInfo} onChange={(e) => setForm({ ...form, contactInfo: e.target.value })} placeholder="email or phone" required />
          </label>
          <label>
            Rescue status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="needs foster">Needs foster</option>
              <option value="needs transport">Needs transport</option>
              <option value="ready for adoption">Ready for adoption</option>
            </select>
          </label>
          <label>
            What should rescuers know?
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} required />
          </label>
          <button type="submit">Post rescue report</button>
          {error && <p className="error-text">{error}</p>}
        </form>

        <section className="card">
          <h2>Recent Rescue Reports</h2>
          {!reports.length ? (
            <p className="status-card">No rescue reports yet.</p>
          ) : (
            <div className="community-feed">
              {reports.map((report) => (
                <article className="community-post" key={report.id}>
                  <div className="row-between">
                    <strong>{report.catName}</strong>
                    <span className="pill supplement">{report.status}</span>
                  </div>
                  <p><strong>Location:</strong> {report.city}</p>
                  <p>{report.description}</p>
                  <p className="muted-line">Contact: {report.contactName} · {report.contactInfo}</p>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(report.city)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open map for this area
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
