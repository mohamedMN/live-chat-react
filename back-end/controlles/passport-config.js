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
async function verifyRefreshToken(req, res, next) {
  try {
    const refreshToken = req.signedCookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    const username = req.user.username;
    console.log("username   in very " + username);
    const refreshTokenDoc = await User.findOne({ username: username });
    if (!refreshTokenDoc || refreshTokenDoc.refreshToken !== refreshToken) {
      return res
        .status(403)
        .json({ message: "Forbidden: Invalid refresh token" });
    }
    // const user = jwt.verify(refreshToken, Access_Secret_Key);
    // if (!user) {
    //   return res.status(401).json({ message: "Invalid refresh token" });
    // }
    next();
  } catch (error) {
    console.error("Error in verifyRefreshToken:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const verifyAccessToken = async (req, res, next) => {
  token = req.headers["authorization"];
  console.log("token  verifyAccessToken has ben caled: " + token);

  if (!token) {
    return res.status(401).json({ message: "AccessToken  is missing" });
  }
  jwt.verify(token.split(" ")[1], Access_Secret_Key, (err, decoded) => {
    if (err) {
      return res.status(402).json({ message: "Invalid token" });
    }
    // req.user = decoded;
    next();
  });
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});
// passport.deserializeUser((userObj, done) => {
//   done(null, userObj);
// });
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
module.exports = {
  authUser,
  generateToken,
  verifyRefreshToken,
  verifyAccessToken,
};
