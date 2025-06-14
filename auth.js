const jwtSecret = "your_jwt_secret"; // Same secret used in passport.js

const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport"); // Import Passport strategies

let generateJWTToken = (user) => {
  return jwt.sign({ _id: user._id }, jwtSecret, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

// POST /login route
module.exports = (router) => {
  router.post("/login", (req, res) => {
    console.log("Login body:", req.body);

    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }

      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }

        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
