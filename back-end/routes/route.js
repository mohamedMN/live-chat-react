const express = require("express");
const router = express.Router();
const {
  verifyAccessToken,
  verifyRefreshToken,
} = require("../controllers/passport-config");
const {
  registerController,
  loginController,
  refreshController,
  profileController,
  usersController,
} = require("../controllers/Controls");

// multer config
const multer = require("multer");
const {
  createChat,
  userChats,
  findChat,
} = require("../controllers/chatController");
const { addMessage, getMessage } = require("../controllers/MessageController");

const storage = multer.memoryStorage(); // Store the image data in memory as a buffer
const upload = multer({ storage });
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./assets/uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage: storage });
//   // JWT && Math.random or uuid => userid && csrf
// to log out
router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
// handling register form
router.post("/register", upload.single("image"), registerController);
//handle login
router.post("/login", loginController);

// the refresh token if the accessToken finished
router.post("/refresh", verifyRefreshToken, refreshController);
// handle the get users api
router.get("/users", verifyAccessToken, usersController);

router.get("/profile", verifyAccessToken, profileController);

router.post("/chat", createChat);
router.get("/chat/:userId", userChats);
router.get("/find/:firstId/:secondId", findChat);
router.post("/message/addMessage", addMessage);
router.get("/message/:chatId", getMessage);

module.exports = router;
