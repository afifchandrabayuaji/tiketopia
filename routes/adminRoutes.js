const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const destinationController = require("../controllers/destinationController");
const commentController = require("../controllers/commentController");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

router.use(isLoggedIn, isAdmin);

router.get("/admin/dashboard", adminController.dashboard);

router.get("/admin/destinations", destinationController.adminListDestinations);
router.get("/admin/destinations/new", destinationController.showCreateForm);
router.post("/admin/destinations", destinationController.createDestination);
router.get("/admin/destinations/:id/edit", destinationController.showEditForm);
router.put("/admin/destinations/:id", destinationController.updateDestination);
router.delete("/admin/destinations/:id", destinationController.deleteDestination);

router.get("/admin/comments", commentController.adminListComments);
router.delete("/admin/comments/:id", commentController.deleteComment);

module.exports = router;
