const User = require("../models/user");
const bcrypt = require("bcrypt");

async function register(pass, username, email) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(pass, salt);
  const user = new User({
    username: username,
    password: hashedPassword,
    email: email,
    refreshToken: "",
  });
  console.log(user);
  await user.save();
  return user;
}
module.exports = { register };
