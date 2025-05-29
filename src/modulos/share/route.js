const express = require("express");
const controller = require("./controller");
const router = express.Router();
const { authenticateToken } = require("../../auth/auth");
const rateLimit = require("express-rate-limit");


router.post('/shares', controller.getSharedByUser);
router.post('/', authenticateToken, controller.postShared);
//router.delete('/', authenticateToken, controller.deleteShared)

module.exports = router;