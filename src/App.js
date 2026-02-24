import { useState, useEffect } from "react";
import "./App.css";
import MovieDisplay from "./components/MovieDisplay";
import Form from "./components/Form";

export default function App() {
  const apiKey = "98e3fb1f";
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getMovie = async (searchTerm) => {
    if (!searchTerm?.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(searchTerm.trim())}`
      );

      if (!response.ok) {
        throw new Error("Request failed. Please try again.");
      }

      const data = await response.json();

      if (data.Response === "False") {
        setMovie(null);
        setError(data.Error || "Movie not found.");
        return;
      }

      setMovie(data);
    } catch (e) {
      setMovie(null);
      setError(e.message || "Something went wrong while fetching movie data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const starterMovies = [
      "Clueless",
      "The Matrix",
      "Spirited Away",
      "Black Panther",
      "The Godfather",
      "Interstellar",
      "Barbie",
      "Parasite",
    ];
    const randomTitle =
      starterMovies[Math.floor(Math.random() * starterMovies.length)];
    getMovie(randomTitle);
  }, []);

  return (
    <div className="app-shell">
      <div className="app-card">
        <h1 className="app-title">Movie Search</h1>
        <p className="app-subtitle">Search OMDB and see movie details instantly.</p>
        <Form moviesearch={getMovie} />
        <MovieDisplay movie={movie} loading={loading} error={error} />
      </div>
    </div>
  );
}
