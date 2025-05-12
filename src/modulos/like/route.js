const express = require("express");
const controller = require("./controller");
const router = express.Router();
const { authenticateToken } = require("../../auth/auth");
const rateLimit = require("express-rate-limit");
const as = require('../filesystem');

router.get('/', controller.getLikedByUser);
router.post('/', authenticateToken, controller.getLikedByUser);
router.delete('/', authenticateToken, controller.deleteLiked);

module.exports = router;