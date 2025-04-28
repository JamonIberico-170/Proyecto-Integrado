const express = require("express");
const controller = require("./controller");
const router = express.Router();
const { authenticateToken } = require("../../auth/auth");
const rateLimit = require("express-rate-limit");


router.get('/', controller.getSharedByUser);
router.post('/');

module.exports = router;