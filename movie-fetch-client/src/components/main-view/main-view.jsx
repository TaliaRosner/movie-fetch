import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "The Matrix",
      description: "A hacker discovers reality is a simulation.",
      genre: "Sci-Fi",
      director: "Lana Wachowski",
      image: "https://m.media-amazon.com/images/I/51EG732BV3L._AC_SY679_.jpg",
    },
    {
      id: 2,
      title: "Inception",
      description: "A thief enters dreams to steal secrets.",
      genre: "Action",
      director: "Christopher Nolan",
      image: "https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SY679_.jpg",
    },
    {
      id: 3,
      title: "Interstellar",
      description: "A journey to save humanity through space.",
      genre: "Adventure",
      director: "Christopher Nolan",
      image:
        "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    },
  ]);

  const [selectedMovie, setSelectedMovie] = useState(null);

  if (selectedMovie) {
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={() => setSelectedMovie(null)}
      />
    );
  }

  return (
    <div>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieClick={(movie) => setSelectedMovie(movie)}
        />
      ))}
    </div>
  );
};

export default MainView;
