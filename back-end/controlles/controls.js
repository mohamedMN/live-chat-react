const User = require("../models/user");
const bcrypt = require("bcrypt");

async function register(password, username, email, filename, path) {
  const salt = await bcrypt.genSalt(10);
  const Password = password.toString();
  const hashedPassword = await bcrypt.hash(Password, salt);
  console.log(password +""+username+" email "+email+" filename "+filename+" path "+path)
  const user = new User({
    username: username,
    password: hashedPassword,
    email: email,
    refreshToken: "",
    image: {
      filename: filename,
      path: path,
    },
  });
  await user.save();
  return user;
}
module.exports = { register };
