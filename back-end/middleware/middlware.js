const express = require("express");
const middleware = express();
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// import body-parser for validation
const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3500"],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

middleware
  .use(cors(corsOptions))
  // initiale the passportJS
  .use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use(express.json()) // This middleware parses JSON request bodies
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser("secret3"));

// middleware.use(printData)
module.exports = middleware;
