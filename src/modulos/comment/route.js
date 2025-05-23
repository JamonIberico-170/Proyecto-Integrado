const express = require("express");
const controller = require("./controller");
const router = express.Router();
const { authenticateToken } = require("../../auth/auth");
const rateLimit = require("express-rate-limit");

router.post('/comments', controller.getCommentsVideo);
router.post('/', authenticateToken, controller.postComment);
router.delete('/', authenticateToken, controller.deleteComment);

module.exports = router;