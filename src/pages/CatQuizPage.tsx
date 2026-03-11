import { useEffect, useState } from "react";
import { fetchCatFacts } from "../api/catHealthApi";
import CatPhotoBanner from "../components/CatPhotoBanner";

const decoys = [
  "Cats can safely live on vegetables alone if they drink enough water.",
  "All cats naturally tolerate cow milk as adults.",
  "A healthy cat should stop grooming often after age five.",
  "Indoor cats never need enrichment if they have food and water.",
];

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function CatQuizPage() {
  const [factPool, setFactPool] = useState<string[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");

  function nextQuestion(facts: string[]) {
    const fallback = "Cats are obligate carnivores and need animal protein.";
    const pool = facts.length ? facts : [fallback];
    const nextFact = pool[Math.floor(Math.random() * pool.length)] || fallback;
    setAnswer(nextFact);
    setChoices(shuffle([nextFact, ...shuffle(decoys).slice(0, 2)]));
    setResult("");
  }

  useEffect(() => {
    async function loadQuiz() {
      try {
        const data = await fetchCatFacts();
        const facts = data.facts?.length ? data.facts : ["Cats are obligate carnivores and need animal protein."];
        setFactPool(facts);
        nextQuestion(facts);
      } catch {
        const facts = ["Cats are obligate carnivores and need animal protein."];
        setFactPool(facts);
        nextQuestion(facts);
      }
    }

    loadQuiz();
  }, []);

  return (
    <section className="page-stack">
      <CatPhotoBanner
        title="Cat Quiz Corner"
        subtitle="Use the live cat facts API to spot the real feline fact from the fake ones."
        tone="peach"
      />

      <section className="card quiz-card">
        <h2>Which statement is a real cat fact?</h2>
        <div className="quiz-options">
          {choices.map((choice) => (
            <button
              className="quiz-option"
              key={choice}
              onClick={() =>
                setResult(
                  choice === answer
                    ? "Correct. That one came from the cat facts API."
                    : "Not quite. Try the next fact and keep going."
                )
              }
              type="button"
            >
              {choice}
            </button>
          ))}
        </div>
        {result && <p className="status-card">{result}</p>}
        <div className="row">
          <button type="button" className="ghost-btn" onClick={() => nextQuestion(factPool)}>
            Next Fact
          </button>
        </div>
      </section>
    </section>
  );
}
