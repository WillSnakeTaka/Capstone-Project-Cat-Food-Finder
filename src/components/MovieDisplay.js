export default function MovieDisplay({ movie, loading, error }) {
  if (loading) {
    return <p className="state-text">Loading movie...</p>;
  }

  if (error) {
    return <p className="state-text error">{error}</p>;
  }

  if (!movie) {
    return <p className="state-text">No movie to display.</p>;
  }

  return (
    <section className="movie-panel">
      <h2 className="movie-title">{movie.Title}</h2>
      <p className="movie-meta">{movie.Year} | {movie.Genre}</p>
      <img
        className="movie-poster"
        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x445?text=No+Poster"}
        alt={movie.Title}
      />
      <p className="movie-plot">{movie.Plot}</p>
    </section>
  );
}
