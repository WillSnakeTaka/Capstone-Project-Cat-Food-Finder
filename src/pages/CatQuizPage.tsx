import { useEffect, useMemo, useState } from "react";
import { fetchCatFacts } from "../api/catHealthApi";
import CatPhotoBanner from "../components/CatPhotoBanner";

interface QuizQuestion {
  prompt: string;
  options: string[];
  answerIndex: number;
  fact: string;
}

const decoys = [
  "Adult cats can stay healthy on a vegetable-only diet.",
  "Indoor cats do not need toys, climbing, or enrichment.",
  "Cats naturally drink enough water from a dry-food-only diet.",
  "Cow milk is a safe daily drink for all adult cats.",
  "Cats stop needing protein-rich food after they become adults.",
  "A cat hiding pain is usually just being dramatic, not ill.",
];

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function buildQuestions(facts: string[]): QuizQuestion[] {
  const fallback = ["Cats are obligate carnivores and need animal protein."];
  const pool = facts.length ? facts : fallback;

  return shuffle(pool)
    .slice(0, Math.min(5, pool.length))
    .map((fact) => {
      const options = shuffle([fact, ...shuffle(decoys).slice(0, 2)]);
      return {
        prompt: "Which option is the real cat fact?",
        options,
        answerIndex: options.indexOf(fact),
        fact,
      };
    });
}

function resultCopy(score: number, total: number) {
  const ratio = total ? score / total : 0;

  if (ratio === 1) {
    return "Perfect score. You can explain cat basics clearly and fast.";
  }

  if (ratio >= 0.6) {
    return "Strong score. Your cat-care instincts are in good shape.";
  }

  return "Decent start. Review the expert guide and run another round.";
}

export default function CatQuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuiz() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchCatFacts();
        const nextQuestions = buildQuestions(data.facts || []);
        setQuestions(nextQuestions);
        setAnswers(Array(nextQuestions.length).fill(-1));
      } catch (err) {
        const nextQuestions = buildQuestions([]);
        setQuestions(nextQuestions);
        setAnswers(Array(nextQuestions.length).fill(-1));
        setError(err instanceof Error ? err.message : "Using fallback cat facts.");
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, []);

  const currentQuestion = questions[currentIndex];
  const answeredCount = useMemo(() => answers.filter((value) => value !== -1).length, [answers]);
  const score = useMemo(
    () => answers.reduce((sum, selected, index) => sum + (selected === questions[index]?.answerIndex ? 1 : 0), 0),
    [answers, questions]
  );

  function chooseOption(optionIndex: number) {
    const next = [...answers];
    next[currentIndex] = optionIndex;
    setAnswers(next);
  }

  function resetQuiz() {
    const nextQuestions = buildQuestions(questions.map((question) => question.fact));
    setQuestions(nextQuestions);
    setAnswers(Array(nextQuestions.length).fill(-1));
    setCurrentIndex(0);
    setSubmitted(false);
  }

  if (loading) {
    return <p className="status-card">Loading quiz questions...</p>;
  }

  if (!questions.length) {
    return <p className="error-text">Quiz questions could not be prepared.</p>;
  }

  if (submitted) {
    return (
      <section className="page-stack">
        <CatPhotoBanner
          title="Cat Quiz Results"
          subtitle="A scored quiz flow based on the sample quiz app pattern, but fed with cat facts for this project."
          tone="mint"
        />

        <section className="card quiz-card quiz-results-card">
          <p className="eyebrow">Result</p>
          <h2>
            {score} / {questions.length} correct
          </h2>
          <p>{resultCopy(score, questions.length)}</p>
          <p className="status-card">Answered {answeredCount} out of {questions.length} questions before submitting.</p>
          <div className="quiz-nav">
            <button type="button" onClick={resetQuiz}>
              Try Another Round
            </button>
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="page-stack">
      <CatPhotoBanner
        title="Cat Quiz Corner"
        subtitle="A proper multi-step quiz with progress, next/back controls, and a scored result screen."
        tone="peach"
      />

      <section className="card quiz-card">
        <div className="quiz-progress">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{answeredCount} answered</span>
        </div>

        <div className="quiz-stage">
          <p className="eyebrow">Live Cat Facts Round</p>
          <h2>{currentQuestion.prompt}</h2>

          <div className="quiz-options">
            {currentQuestion.options.map((choice, index) => (
              <button
                className={`quiz-option ${answers[currentIndex] === index ? "selected" : ""}`}
                key={choice}
                onClick={() => chooseOption(index)}
                type="button"
              >
                {choice}
              </button>
            ))}
          </div>

          {error && <p className="status-card">{error}</p>}
        </div>

        <div className="quiz-nav">
          <button
            type="button"
            className="ghost-btn"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
          >
            Back
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (answers.some((answer) => answer === -1)) {
                  setError("Answer every question before submitting.");
                  return;
                }

                setError("");
                setSubmitted(true);
              }}
            >
              Submit Quiz
            </button>
          )}
        </div>
      </section>
    </section>
  );
}
