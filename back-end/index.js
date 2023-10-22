const express = require("express");
const app = express();
const routes = require("./routes/route");
const mongoose = require("mongoose");
const middleware = require("./middleware/middlware");
const socketIo = require("socket.io");
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
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log("Server on start  http://localhost:" + PORT);
});
// socket server starting
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
let count = 1;
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id} client numero : ${count++}`);
  socket.on("chat message", (message) => {
    io.emit("chat message", message);
  });
  socket.on("disconnected", () => {
    console.log("User disconnected: ${socket.id}");
  });
});
// call the routes in route folder
app.use(middleware, routes);

// start of the serveur
