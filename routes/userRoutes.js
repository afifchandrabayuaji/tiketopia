const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { isLoggedIn } = require("../middlewares/auth");

router.get("/my-orders", isLoggedIn, transactionController.myOrders);

module.exports = router;
