const express = require("express");
const app = express();
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const {
  authUser,
  generateToken,
  verifyToken,
} = require("../controlles/passport-config");
const LocalStrategy = require("passport-local").Strategy;
const { register } = require("../controlles/controls");
const bodyParser = require("body-parser");
//=====================
// ROUTES
//=====================
// the login page
// if user already connected
app.use(express.json()); // This middleware parses JSON request bodies
app.use(bodyParser.json());

passport.use(new LocalStrategy(authUser));
// to check if session of user is set
// checkLoggedIn = (req, res, next) => {
//   if (req.isAuthenticated()) return res.redirect("/dashboard");

//   // JWT && Math.random or uuid => userid && csrf
//   next();
// };
// checkAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) return next();
//   res.redirect("/login");
// };

// to log out
router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
//handle login
router.post("/login", (req, res) => {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Authentication failed!" });
    }
    const token = generateToken(user);
    // Send the token as a JSON response
    return res.status(200).json({ token });
  })(req, res);
});
// handling register form
router.post("/register", async (req, res) => {
  register(
    req.body.password,
    req.body.confirm_password,
    req.body.username,
    req.body.email
  );
});
// handle the get users api
router.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

//Handling user logout
router.get("/logout", (req, res) => {});

module.exports = router;
