const express = require("express");
const controller = require("./controller");
const router = express.Router();
const { authenticateToken } = require("../../auth/auth");
const rateLimit = require("express-rate-limit");
const filesystem = require('../filesystem')
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // máximo 5 registros
  message: {
    status: 429,
    message: "Demasiadas cuentas creadas desde esta IP. Intenta más tarde.",
  },
});
// login, borrar token, crear token
router.get("/", authenticateToken, controller.getUser);

router.post("/profile_image",  filesystem.getImage);

// router.get("/id/:id", authenticateToken, controller.getUserById);

// #region GETS
router.get("/nickname", controller.getUserByNick);

router.get("/username", controller.getUserByName);

router.post("/uploadvideo",  controller.getUploadVideo);

router.post("/following",  controller.getFollowingUsers);

router.post("/followers",  controller.getFollowers);

router.post("/auth/login",  controller.loginUser);

router.post("/auth/login_jwt",  controller.loginJWT);

// #endregion

router.post("/follow", authenticateToken, controller.postFollow);

router.post("/unfollow", authenticateToken, controller.postUnfollow);

router.post("/auth/register",  controller.postUser);

router.put("/", authenticateToken, controller.putUser);

router.delete("/", authenticateToken, controller.deleteUser);

module.exports = router;
