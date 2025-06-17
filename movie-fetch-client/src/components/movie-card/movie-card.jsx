export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        margin: "10px",
        cursor: "pointer",
      }}
      onClick={() => onMovieClick(movie)}
    >
      <h3>{movie.title}</h3>
    </div>
  );
};
