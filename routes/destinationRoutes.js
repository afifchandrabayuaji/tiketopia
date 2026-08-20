const express = require("express");
const router = express.Router();
const destinationController = require("../controllers/destinationController");
const commentController = require("../controllers/commentController");
const transactionController = require("../controllers/transactionController");
const { isLoggedIn } = require("../middlewares/auth");

router.get("/destinations", destinationController.listDestinations);
router.get("/destinations/:id", destinationController.showDetail); // guard login ada di dalam controller

router.post("/destinations/:id/comments", isLoggedIn, commentController.createComment);
router.post("/tickets/:ticketId/buy", isLoggedIn, transactionController.buyTicket);

module.exports = router;
