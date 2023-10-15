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
const secretKey = process.env.secretKey;

// Implement JWT generation function
function generateToken(user) {
  return jwt.sign(user.toJSON(), secretKey, { expiresIn: 60 * 60 }); // expiresIn : 1H
}
// handle the JWT acces
function verifyToken(req, res, next) {
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }
  jwt.verify(token.split(" ")[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

passport.serializeUser((userObj, done) => {
  done(null, userObj);
});
passport.deserializeUser((userObj, done) => {
  done(null, userObj);
});

module.exports = { authUser, generateToken, verifyToken };
