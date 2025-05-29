const express = require("express");
const controller = require("./controller");
const controller2 = require("./filesystem");
const likedController = require("./../like/controller");
const favController = require("./../fav/controller");
const router = express.Router();
const { authenticateToken } = require("../../auth/auth");
const utilities = require("../../utils/utils");

/*
    Rutas:
    -> Una para obtener un video en específico
    -> Una para obtener un video al azar
    -> Una para obtener un lista de videos
    
    ->

*/
// router.get('/', );

router.get("/randomvideo", controller.get5RandomVideo);
// router.post("/likedvideo", likedController.getLikedByUser);
// router.post("/favvideo", favController.getFavByUser);

router.get("/download", controller2.getVideo);

router.post("/", authenticateToken, controller.getVideoById);

//router.get("/", controller2.getVideoURL);

router.post(
  "/upload",
  authenticateToken,
  (req, res, next) => {
    req.url = utilities.randomURL();
    next();
  },

  controller2.uploadVideo,
  controller.postVideo
);

router.delete("/", authenticateToken, controller.deleteVideo);
module.exports = router;
