const middleware = require("express")();
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
// import body-parser for validation

bodyParser = require("body-parser");
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:5173",
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
  //start cockie
  // Configure body-parser middleware
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser());

// middleware.use(printData)
module.exports = middleware;
