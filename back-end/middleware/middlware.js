const middleware = require("express")();
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
middleware.use(cors(corsOptions));
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
// Configure body-parser middleware
middleware.use(bodyParser.json());
middleware.use(bodyParser.urlencoded({ extended: true }));

// middleware.use(printData)
module.exports = middleware;
