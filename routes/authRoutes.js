const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { isGuest } = require("../middlewares/auth");

router.get("/login", isGuest, authController.showLogin);
router.post("/login", isGuest, authController.login);
router.get("/register", isGuest, authController.showRegister);
router.post("/register", isGuest, authController.register);
router.post("/logout", authController.logout);

module.exports = router;
