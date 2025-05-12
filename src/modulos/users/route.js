/*
    Rutas:
    -> Una para obtener un usuario en específico
    -> Una para obtener los videos a los que se les han dado like
    -> Una para obtener los vídeos a los que se les ha dada fav

    
}
*/
const express = require("express");
const controller = require("./controller");
const router = express.Router();
const { authenticateToken } = require("../../auth/auth");
const rateLimit = require("express-rate-limit");

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // máximo 5 registros
  message: {
    status: 429,
    message: "Demasiadas cuentas creadas desde esta IP. Intenta más tarde.",
  },
});
// login, borrar token, crear token
router.get("/", authenticateToken, controller.get);

// router.get("/id/:id", authenticateToken, controller.getUserById);

router.get("/nickname", authenticateToken, controller.getUserByNick);

router.get("/username", authenticateToken, controller.getUserByName);

router.get("/following",  controller.getFollowingUsers);

router.get("/followers",  controller.getFollowers);

router.post("/", registerLimiter, controller.postUser);

router.post("/follow", authenticateToken, controller.postFollow);
router.post("/unfollow", authenticateToken, controller.postUnfollow);

router.put("/", authenticateToken, controller.putUser);

//Hacer
router.delete("/", authenticateToken, controller.deleteUser);

module.exports = router;
