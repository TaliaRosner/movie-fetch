// index.js
const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("common")); // Logging all requests
app.use(express.json()); // Parsing JSON request bodies
app.use(express.static("public")); // Serving static files

// Movie data with full details (Bonus task: "in-memory" array)
const movies = [
  {
    title: "The Shawshank Redemption",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    genre: "Drama",
    director: "Frank Darabont",
    imageURL: "https://example.com/shawshank.jpg",
  },
  {
    title: "The Godfather",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    genre: "Crime",
    director: "Francis Ford Coppola",
    imageURL: "https://example.com/godfather.jpg",
  },
  {
    title: "The Dark Knight",
    description:
      "Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre: "Action",
    director: "Christopher Nolan",
    imageURL: "https://example.com/darkknight.jpg",
  },
  {
    title: "Pulp Fiction",
    description:
      "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in tales of violence and redemption.",
    genre: "Crime",
    director: "Quentin Tarantino",
    imageURL: "https://example.com/pulpfiction.jpg",
  },
  {
    title: "Forrest Gump",
    description:
      "The story of Forrest Gump, a man with a low IQ, and the epic journey he takes through life.",
    genre: "Drama",
    director: "Robert Zemeckis",
    imageURL: "https://example.com/forrestgump.jpg",
  },
  {
    title: "Inception",
    description:
      "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    genre: "Sci-Fi",
    director: "Christopher Nolan",
    imageURL: "https://example.com/inception.jpg",
  },
  {
    title: "Fight Club",
    description:
      "An insomniac office worker and a devil-may-care soapmaker form an underground fight club.",
    genre: "Drama",
    director: "David Fincher",
    imageURL: "https://example.com/fightclub.jpg",
  },
  {
    title: "The Matrix",
    description:
      "A hacker learns from mysterious rebels about the true nature of his reality and his role in the war.",
    genre: "Sci-Fi",
    director: "The Wachowskis",
    imageURL: "https://example.com/matrix.jpg",
  },
  {
    title: "Goodfellas",
    description:
      "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.",
    genre: "Crime",
    director: "Martin Scorsese",
    imageURL: "https://example.com/goodfellas.jpg",
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    description:
      "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam.",
    genre: "Fantasy",
    director: "Peter Jackson",
    imageURL: "https://example.com/lotr.jpg",
  },
];

// Route to return all movies
app.get("/movies", (req, res) => {
  res.json(movies);
});

// Route to return one movie by title
app.get("/movies/:title", (req, res) => {
  const movie = movies.find(
    (m) => m.title.toLowerCase() === req.params.title.toLowerCase()
  );
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send("Movie not found");
  }
});

// Default route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to Movie-Fetch API! 🎬");
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Register a new user
app.post("/users", (req, res) => {
  const newUser = req.body;
  res.send(`User ${newUser.username} registered!`);
});

// Update user info (e.g., username)
app.put("/users/:username", (req, res) => {
  const currentUsername = req.params.username;
  const updatedUser = req.body;
  res.send(
    `User ${currentUsername} has been updated to ${updatedUser.username}`
  );
});

// Add movie to user's favorites
app.post("/users/:username/movies/:movieId", (req, res) => {
  const { username, movieId } = req.params;
  res.send(`Movie ${movieId} added to ${username}'s favorites`);
});

// Remove a movie from user's favorites
app.delete("/users/:username/movies/:movieId", (req, res) => {
  const { username, movieId } = req.params;
  res.send(`Movie ${movieId} removed from ${username}'s favorites`);
});

// Deregister an existing user
app.delete("/users/:username", (req, res) => {
  const { username } = req.params;
  res.send(`User ${username} has been deregistered`);
});

// Return genre description by name
app.get("/genres/:genreName", (req, res) => {
  res.send(`Return description for genre: ${req.params.genreName}`);
});

// Return director info by name
app.get("/directors/:directorName", (req, res) => {
  res.send(`Return data about director: ${req.params.directorName}`);
});

// Start server
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
