require("dotenv").config();
console.log("MONGODB_URI value is:", process.env.MONGODB_URI);
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Models = require("./models.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const { check, validationResult } = require("express-validator");

const app = express();

const Movies = Models.Movie;
const Users = Models.User;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas.");

    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`App is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(morgan("common")); // Logging all requests
app.use(express.json()); // Parsing JSON request bodies
app.use(express.static("public")); // Serving static files
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors()); // Allow all origins
let auth = require("./auth")(app);

const passport = require("passport");
require("./passport"); // Importing passport strategies
app.use(passport.initialize()); // Needed to activate Passport middleware

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
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

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
app.post(
  "/users",
  [
    check("Username", "Username is required").notEmpty(),
    check("Username", "Username must be at least 5 characters").isLength({
      min: 5,
    }),
    check(
      "Username",
      "Username contains non-alphanumeric characters - not allowed"
    ).isAlphanumeric(),
    check("Password", "Password is required").notEmpty(),
    check("Password", "Password must be at least 8 characters").isLength({
      min: 8,
    }),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const hashedPassword = Users.hashPassword(req.body.Password);
      const user = await Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      });

      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

// Route to return all users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => res.status(200).json(users))
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Route to get a user by username
app.get(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.username })
      .then((user) => {
        if (!user) {
          return res.status(404).send("User not found");
        }
        res.status(200).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Update user info (e.g., username, password, email, birthday)
app.put(
  "/users/:username",
  [
    check("Username").optional().isLength({ min: 5 }),
    check("Username").optional().isAlphanumeric(),
    check("Password").optional().isLength({ min: 8 }),
    check("Email").optional().isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    console.log("Authenticated user from JWT:", req.user);
    next();
  },
  async (req, res) => {
    console.log("req.user:", req.user);
    if (req.user.Username !== req.params.username) {
      return res.status(400).send("Permission denied");
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword;
    if (req.body.Password) {
      hashedPassword = Users.hashPassword(req.body.Password);
    }

    try {
      const updatedUser = await Users.findOneAndUpdate(
        { Username: req.params.username },
        {
          $set: {
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send("User not found");
      }

      return res.status(200).json(updatedUser);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error: " + err);
    }
  }
);

// TEMP: Add a movie (for testing only)
app.post("/movies", (req, res) => {
  Movies.create(req.body)
    .then((movie) => res.status(201).json(movie))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Add movie to user's favorites
app.post(
  "/users/:username/movies/:movieId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.Username !== req.params.username) {
      return res.status(400).send("Permission denied");
    }
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
  }
);

// Remove a movie from user's favorites (with Mongoose)
app.delete(
  "/users/:username/movies/:movieId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.Username !== req.params.username) {
      return res.status(400).send("Permission denied");
    }
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
  }
);

// Deregister an existing user (delete user document)
app.delete(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.Username !== req.params.username) {
      return res.status(400).send("Permission denied");
    }
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
  }
);

// Return genre description by name
app.get(
  "/genres/:genreName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);

// Return director info by name
app.get(
  "/directors/:directorName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
  }
);
