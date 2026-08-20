const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { isLoggedIn } = require("../middlewares/auth");

router.put("/comments/:id", isLoggedIn, commentController.updateComment);
router.delete("/comments/:id", isLoggedIn, commentController.deleteComment);

module.exports = router;
