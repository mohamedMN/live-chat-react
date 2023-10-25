const User = require("../models/User");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

const registerController = async (req, res) => {
  const { password, username, email } = req.body;
  // const filename = req.file.filename;
  // const path = req.file.path;

  if (req.file) {
    var data = req.file.buffer;
  } else {
    const defaultImagePath = path.join(
      __dirname,
      "../assets/images/images.jpg"
    );
    var data = fs.readFileSync(defaultImagePath);
  }
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
};
async function register(password, username, email, data) {
  const salt = await bcrypt.genSalt(10);
  const Password = password.toString();
  const hashedPassword = await bcrypt.hash(Password, salt);
  const user = new User({
    username: username,
    password: hashedPassword,
    email: email,
    refreshToken: "",
    image: {
      data: data,
    },
  });
  await user.save();
  return user;
}
// handle Login Controller
const passport = require("passport");
const { authUser, generateToken } = require("./passport-config");
const LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy(authUser));

const loginController = async (req, res) => {
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
};
const refreshController = (req, res) => {
  const username = req.session.user.username;
  const accessToken = generateToken({ username }, 10); //expired: 15min
  res
    .status(200)
    .json({ accessToken, message: "the refresh token is created" });
};

const usersController = async (req, res) => {
  // const id = req.session.user._id; // akhiran 7alitha
  // const { refreshToken } = req.signedCookies;
  // console.log("req.refreshToken " + refreshToken);
  try {
    const username = req.session.user.username;
    const users = await User.find();
    res.status(200).json({ users, username });
  } catch (error) {
    res.status(500).json({ message: "error in mangose function" });
  }
};
const profileController = async (req, res) => {
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
};

module.exports = {
  registerController,
  refreshController,
  loginController,
  register,
  usersController,
  profileController,
};
