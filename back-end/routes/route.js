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

passport.use(new LocalStrategy(authUser));

// multer config
const multer = require("multer");

const storage = multer.memoryStorage(); // Store the image data in memory as a buffer
const upload = multer({ storage });
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./assets/uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage: storage });
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
router.post("/register", upload.single("image"), async (req, res) => {
  const { password, username, email } = req.body;
  // const filename = req.file.filename;
  // const path = req.file.path;
  const data = req.file.buffer;
  // console.log("data : " + data);
  if (req.body.confirm_password !== password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  try {
    const user = await register(password, username, email, data);
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
    const accessToken = generateToken({ id: _id }, 100000); // Expire in 10 seconds
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
  const username = req.session.user.username;
  const accessToken = generateToken({ username }, 10); //expired: 15min
  res
    .status(200)
    .json({ accessToken, message: "the refresh token is created" });
});
// handle the get users api
router.get("/users", verifyAccessToken, async (req, res) => {
  // const id = req.session.user._id; // akhiran 7alitha
  // const { refreshToken } = req.signedCookies;
  // console.log("req.refreshToken " + refreshToken);
  try {
    const username = req.session.user.username;
    const users = await User.find();
    res.status(200).json({users, username});
  } catch (error) {
    res.status(500).json({ message: "error in mangose function" });
  }
});

router.get("/profile", verifyAccessToken, async (req, res) => {
  try {
    const id = req.session.user._id;
    const username = req.session.user.username;
    console.log("username :" + username);
    const user = await User.findById(id);
    const encodedImage = user.image.data.toString("base64");

    const USER = {
      id: user._id,
      username: user.username,
      email: user.email,
      image: {
        image: encodedImage,
      },
    };
    res.status(200).json(USER);
  } catch (error) {
    res.status(500).json({ message: "error in findById function" });
  }
});

//Handling user logout
router.get("/logout", (req, res) => {});

module.exports = router;
