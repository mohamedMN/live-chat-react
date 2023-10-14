const middleware = require("express")();
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser"); // Require cookie-parser
// initiale the passportJS
middleware.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
middleware.use(passport.initialize());
middleware.use(passport.session());
// import body-parser for validation
bodyParser = require("body-parser");
//start cockie
middleware.use(cookieParser());
var count = 0;

// Configure body-parser middleware
middleware.use(bodyParser.json());
middleware.use(bodyParser.urlencoded({ extended: true }));

// printData = (req, res, next) => {
//   console.log("\n==============================");
//   console.log(`------------>  ${count++}`);

//   console.log(`req.body.username -------> ${req.body.username}`);
//   console.log(`req.body.password -------> ${req.body.password}`);

//   console.log(`\n req.session.passport -------> `);
//   console.log(req.session.passport);

//   console.log(`\n req.user -------> `);
//   console.log(req.user);

//   console.log("\n Session and Cookie");
//   console.log(`req.session.id -------> ${req.session.id}`);
//   console.log(`req.session.cookie -------> `);
//   console.log(req.session.cookie);

//   console.log("===========================================\n");

//   next();
// };

// middleware.use(printData)
module.exports = middleware;
