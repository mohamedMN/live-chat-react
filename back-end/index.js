const express = require("express");
const app = express();
const routes = require("./routes/route");
const mongoose = require("mongoose");
const middleware = require("./middleware/middlware");
//Load Environment Variables
require("dotenv").config();
const url = process.env.MONGOLAB_URI;
async function connection() {
  try {
    await mongoose.connect(url);
    console.log("connected to db");
  } catch (err) {
    console.error(err);
  }
}
//call up conncetion function
connection();
// Définir le moteur de vues EJS
app.set("view engine", "ejs");
// Définir la répertoire des vues
app.set("views", "./views");
// call the routes in route folder
app.use(middleware, routes);

// start of the serveur
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server on start  http://localhost:" + PORT);
});
