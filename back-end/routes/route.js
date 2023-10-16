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
// handling register form
router.post("/register", async (req, res) => {
  if (req.body.confirm_password !== req.body.password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  try {
    const user = await register(
      req.body.password,
      req.body.username,
      req.body.email
    );
    if (user) {
      return res.status(201).json({ message: "User successfully created" });
    } else {
      return res.status(500).json({ message: "Registration failed" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
});
//handle login
router.post("/login", async (req, res) => {
  await passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Authentication failed!" });
    }
    const accessToken = generateToken(user, 24 * 60 * 60 * 1000);

    res.cookie("authToken", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // maxAge: 1day
    });

    res.status(200).json({ accessToken, message: "Authentication successful" });
  })(req, res);
});

router.post("/refresh", (req, res) => {
  const accessToken = generateToken(req.body.username, 900);
  console.log("refresh has been called : " + accessToken);
  res
    .status(200)
    .json({ accessToken, message: "the refresh token is created" });
});

// handle the get users api
router.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "error in mangose function" });
  }
});
//Handling user logout
router.get("/logout", (req, res) => {});

module.exports = router;
