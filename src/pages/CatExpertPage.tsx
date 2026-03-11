import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCatFacts, fetchCatImage } from "../api/catHealthApi";

const trustedLinks = [
  { label: "AAFP Cat Care", href: "https://catvets.com/guidelines" },
  { label: "ASPCA Cat Care", href: "https://www.aspca.org/pet-care/cat-care" },
  { label: "Cornell Feline Health", href: "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center" },
  { label: "AVMA Pet Health", href: "https://www.avma.org/resources-tools/pet-owners/petcare" },
  { label: "Poison Control (ASPCA)", href: "https://www.aspca.org/pet-care/animal-poison-control" },
];

export default function CatExpertPage() {
  const [facts, setFacts] = useState<string[]>([]);
  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    async function loadHealthContent() {
      try {
        const [factsData, imageData] = await Promise.all([fetchCatFacts(), fetchCatImage()]);
        setFacts(factsData.facts || []);
        setHeroImage(imageData.imageUrl || "");
      } catch {
        setFacts([]);
      }
    }

    loadHealthContent();
  }, []);

  return (
    <section className="expert-page">
      <div className="expert-hero card">
        <h1>Cat Health & Wellness Hub</h1>
        <p>Vet-focused tips, emergency resources, and live cat facts API feed.</p>
        {heroImage && <img className="expert-hero-image" src={heroImage} alt="Healthy cat" />}
      </div>

      <div className="expert-grid">
        <article className="expert-card card">
          <h2>Daily Health Checklist</h2>
          <ul>
            <li>Fresh water available all day</li>
            <li>Measured meals with high-protein cat food</li>
            <li>Litter box output checked daily</li>
            <li>10-20 minutes of active play</li>
            <li>Weekly weight/body condition check</li>
          </ul>
        </article>

        <article className="expert-card card emergency">
          <h2>Emergency Signs</h2>
          <ul>
            <li>Not eating for more than 24 hours</li>
            <li>Trouble urinating or no urine</li>
            <li>Labored breathing</li>
            <li>Repeated vomiting/diarrhea</li>
            <li>Sudden collapse or seizures</li>
          </ul>
          <p><strong>When in doubt, call your vet immediately.</strong></p>
        </article>

        <article className="expert-card card">
          <h2>Live Cat Facts (API)</h2>
          {!facts.length ? (
            <p className="status-card">Loading cat facts...</p>
          ) : (
            <ul>
              {facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          )}
        </article>

        <article className="expert-card card">
          <h2>Trusted Health Links</h2>
          <ul>
            {trustedLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
              </li>
            ))}
          </ul>
        </article>

        <article className="expert-card card">
          <h2>More Cat Tools</h2>
          <div className="row">
            <Link className="btn-link" to="/quiz">Take the cat quiz</Link>
            <Link className="btn-link ghost" to="/rescue">Open rescue board</Link>
          </div>
        </article>
      </div>
    </section>
  );
}
