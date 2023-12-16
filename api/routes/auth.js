const router = require("express").Router();
const User = require("../models/User.js");
const authController = require("../controllers/authController.js");

/////////Register
router.post("/register", authController.register);

//////Login
router.post("/login", authController.login);

module.exports = router;
