const express = require("express");
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

passport.use(new LocalStrategy(authUser));

//   // JWT && Math.random or uuid => userid && csrf
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
    const user = await new Promise((resolve, reject) => {
      passport.authenticate("local", { session: true }, (err, user) => {
        if (err || !user) {
          return reject("Authentication failed!");
        }
        resolve(user);
      })(req, res);
    });
    req.session.user = user;
    await req.session.save;
    const { _id } = user;
    let options = {
      maxAge: 24 * 60 * 60 * 1000, // would expire after 1 day
      httpOnly: true,
      signed: true,
    };
    const accessToken = generateToken({ id: _id }, 1000000); // Expire in 10 seconds
    const refreshToken = generateToken({ id: _id }, 24 * 60 * 60 * 1000); // Expire in 1 day
    res.cookie("refreshToken", refreshToken, options);
    // Update the user with the refreshToken
    await User.updateOne({ _id }, { $set: { refreshToken } });

    res.status(200).json({ accessToken, message: "Authentication successful" });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// the refresh token if the accessToken finished
router.post("/refresh", verifyRefreshToken, (req, res) => {
  const accessToken = generateToken({ username }, 10); //expired: 15min
  res
    .status(200)
    .json({ accessToken, message: "the refresh token is created" });
});
// handle the get users api
router.get("/users", async (req, res) => {
  const username = req.session.user._id; // akhiran 7alitha 
  console.log("Username from session: " + username);
  // const { refreshToken } = req.signedCookies;
  // console.log("req.refreshToken " + refreshToken);
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "error in mangose function" });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "error in findById function" });
  }
});

//Handling user logout
router.get("/logout", (req, res) => {});

module.exports = router;
