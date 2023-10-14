const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const user = require("../models/user");
const bcrypt = require("bcrypt");

async function register(pass, confirmPass, username, email) {
  if (pass === confirmPass) {
    // generate salt
    const salt = await bcrypt.genSalt(10);
    // hash the password
    const hashedPassword = await bcrypt.hash(pass, salt);
    // replace plain text password with hashed password
    let password = hashedPassword;
    const user = new User({
      username: username,
      password: password,
      email: email,
    });

    console.log(user);
    await user.save();
    res.render("login");
  } else {
    return res.status(404).json({ message: "no matching in password" });
  }
}

module.exports = {register};
