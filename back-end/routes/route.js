const express = require("express");
const app = express();
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const {
  authUser,
  generateToken,
  verifyAccessToken,
  verifyRefreshToken,
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
  try {
    await passport.authenticate(
      "local",
      { session: false },
      async (err, user) => {
        if (err || !user) {
          return res.status(401).json({ message: "Authentication failed!" });
        }
        const accessToken = generateToken(
          { id: user._id, username: user.username },
          10 // Expired: 30 seconds
        );

        const refreshToken = generateToken(
          { id: user._id, username: user.username },
          24 * 60 * 60 * 1000 // Expired: 1 day
        );
        // Update the user with the refreshToken
        await User.updateOne(
          { _id: user._id },
          { $set: { refreshToken: refreshToken } }
        );
        res.cookie("authToken", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // MaxAge: 1 day
        });

        res
          .status(200)
          .json({ accessToken, message: "Authentication successful" });
      }
    )(req, res);
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// the refresh token if the accessToken finished
router.post("/refresh", verifyRefreshToken, (req, res) => {
  let username = req.user.username;
  console.log("username : " + username);
  const accessToken = generateToken({ username }, 10); //expired: 15min
  res
    .status(200)
    .json({ accessToken, message: "the refresh token is created" });
});

// handle the get users api
router.get("/users", verifyAccessToken, async (req, res) => {
  const authToken = req.cookies['authToken'];
  console.log("refreshToken :" + authToken);
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
