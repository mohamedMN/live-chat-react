const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  image: {
    data: Buffer,
    filename: String,
    path: String,
    createdAt: { type: Date, default: Date.now },
  },
});

userSchema.plugin(passportLocalMongoose);

const collection = mongoose.model("User", userSchema);
module.exports = collection;
