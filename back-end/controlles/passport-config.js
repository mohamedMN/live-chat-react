const passport = require("passport");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authUser = async (username, password, done) => {
  const data = await User.findOne({ username: username });
  if (!data)
    return done(null, false, {
      message: "Cannot find user with that username",
    });
  try {
    const checkPassword = await bcrypt.compare(password, data.password);
    if (!checkPassword)
      return done(null, false, { message: "Incorrect password" });
    if (data) done(null, data);
  } catch (err) {
    return done(err);
  }
};

// Define your secret key for JWT generation
const Access_Secret_Key = process.env.Access_Secret_Key;

// Implement JWT generation function
function generateToken(user, temps) {
  return jwt.sign(user, Access_Secret_Key, { expiresIn: temps }); // expiresIn : 1H
}
// handle the JWT acces
const verifyRefreshToken = async (req, res, next) => {
  // token = req.headers.authorization;
  // console.log("token  : " + token);

  if (!refreshToken) {
    return res.status(401).json({ message: "refreshToken is missing" });
  }
  const user = await User.findOne({ refreshToken: refreshToken });

  if (!user)
    return res.status(403).json({ message: "no user with that token " });

  jwt.verify(refreshToken.split(" ")[1], Access_Secret_Key, (err, decoded) => {
    if (err) {
      return res.status(402).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

const verifyAccessToken = async (req, res, next) => {
  token = req.headers.authorization;
  console.log("token  : " + token);

  if (!token) {
    return res.status(401).json({ message: "AccessToken  is missing" });
  }
  jwt.verify(token.split(" ")[1], Access_Secret_Key, (err, decoded) => {
    if (err) {
      return res.status(402).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

passport.serializeUser((userObj, done) => {
  done(null, userObj);
});
passport.deserializeUser((userObj, done) => {
  done(null, userObj);
});

module.exports = {
  authUser,
  generateToken,
  verifyRefreshToken,
  verifyAccessToken,
};
