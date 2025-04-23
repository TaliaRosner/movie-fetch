const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("common")); // Logging all requests
app.use(express.static("public")); // Serving static files

// Top 10 movies data
let topMovies = [
  { title: "The Shawshank Redemption", director: "Frank Darabont" },
  { title: "The Godfather", director: "Francis Ford Coppola" },
  { title: "The Dark Knight", director: "Christopher Nolan" },
  { title: "Pulp Fiction", director: "Quentin Tarantino" },
  { title: "Forrest Gump", director: "Robert Zemeckis" },
  { title: "Inception", director: "Christopher Nolan" },
  { title: "Fight Club", director: "David Fincher" },
  { title: "The Matrix", director: "The Wachowskis" },
  { title: "Goodfellas", director: "Martin Scorsese" },
  {
    title: "The Lord of the Rings: The Return of the King",
    director: "Peter Jackson",
  },
];

// Route to return JSON movie list
app.get("/movies", (req, res) => {
  res.json(topMovies);
});

// Default route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to Movie-Fetch API! 🎬");
});

// Listen for incoming requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // logs the error stack trace to terminal
  res.status(500).send("Something broke!");
});

// Return all movies
app.get("/movies", (req, res) => {
  res.send("Return a list of all movies");
});

// Return one movie by title
app.get("/movies/:title", (req, res) => {
  res.send(`Return data about movie: ${req.params.title}`);
});

// Return genre description by name
app.get("/genres/:genreName", (req, res) => {
  res.send(`Return description for genre: ${req.params.genreName}`);
});

// Return director info by name
app.get("/directors/:directorName", (req, res) => {
  res.send(`Return data about director: ${req.params.directorName}`);
});
