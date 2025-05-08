const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Models = require("./models.js");

const app = express();

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/moviefetch", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(morgan("common")); // Logging all requests
app.use(express.json()); // Parsing JSON request bodies
app.use(express.static("public")); // Serving static files

// Route to return all movies
app.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Route to return one movie by title
app.get("/movies/:title", (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      if (movie) {
        res.json(movie);
      } else {
        res.status(404).send("Movie not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
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
  Users.create(req.body)
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Route to return all users
app.get("/users", (req, res) => {
  Users.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Update user info (e.g., username, password, email, birthday)
app.put("/users/:username", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send("User not found");
      }
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// TEMP: Add a movie (for testing only)
app.post("/movies", (req, res) => {
  Movies.create(req.body)
    .then((movie) => res.status(201).json(movie))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Update a movie by title
app.put("/movies/:title", (req, res) => {
  Movies.findOneAndUpdate(
    { Title: req.params.title },
    {
      $set: {
        Title: req.body.Title,
        Description: req.body.Description,
        Genre: req.body.Genre,
        Director: req.body.Director,
        Actors: req.body.Actors,
        ImagePath: req.body.ImagePath,
        Featured: req.body.Featured,
      },
    },
    { new: true }
  )
    .then((updatedMovie) => {
      if (!updatedMovie) {
        return res.status(404).send("Movie not found");
      }
      res.status(200).json(updatedMovie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Add movie to user's favorites
app.post("/users/:username/movies/:movieId", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.username },
    {
      $addToSet: {
        FavoriteMovies: new mongoose.Types.ObjectId(req.params.movieId),
      },
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).send("User not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Remove a movie from user's favorites (with Mongoose)
app.delete("/users/:username/movies/:movieId", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.username },
    { $pull: { FavoriteMovies: req.params.movieId } },
    { new: true }
  )
    .then((updatedUser) => {
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).send("User not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Deregister an existing user (delete user document)
app.delete("/users/:username", (req, res) => {
  Users.findOneAndDelete({ Username: req.params.username })
    .then((deletedUser) => {
      if (deletedUser) {
        res.status(200).send(`User ${req.params.username} was deregistered.`);
      } else {
        res.status(404).send("User not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return genre description by name
app.get("/genres/:genreName", (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.genreName })
    .then((movie) => {
      if (movie) {
        res.json(movie.Genre);
      } else {
        res.status(404).send("Genre not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return director info by name
app.get("/directors/:directorName", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movie) => {
      if (movie) {
        res.json(movie.Director);
      } else {
        res.status(404).send("Director not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Start server
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
