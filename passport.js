const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Models = require("./models.js");
const passportJWT = require("passport-jwt");
const jwtSecret = "your_jwt_secret";

let Users = Models.User;
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    async (username, password, callback) => {
      console.log("Incoming login:", username, password);

      await Users.findOne({ Username: username })
        .then((user) => {
          if (!user) {
            return callback(null, false, {
              message: "Incorrect username",
            });
          }

          // Add this plain password check
          if (!user.validatePassword(password)) {
            return callback(null, false, {
              message: "Incorrect password",
            });
          }

          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    },
    async (jwtPayload, callback) => {
      console.log("JWT payload:", jwtPayload);

      return await Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
