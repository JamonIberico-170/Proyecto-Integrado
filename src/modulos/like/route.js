const express = require("express");
const controller = require("./controller");
const router = express.Router();
const { authenticateToken } = require("../../auth/auth");

router.post("/user", controller.getLikedByUser);
router.post("/", authenticateToken, controller.postLiked);
router.delete("/", authenticateToken, controller.deleteLiked);

module.exports = router;
