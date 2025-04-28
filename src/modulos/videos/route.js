const express = require("express");
const controller = require("./controller");
const controller2 = require("./filesystem");
const router = express.Router();
const { authenticateToken } = require("../../auth/auth");
const path = require("path");
/*
    Rutas:
    -> Una para obtener un video en específico
    -> Una para obtener un video al azar
    -> Una para obtener un lista de videos
    
    ->

*/
// router.get('/', );

router.get("/randomvideo", authenticateToken);
router.get("/likedvideo", authenticateToken);
router.get("/favvideo", authenticateToken);


//Mirar si puedo pasar meta datos y videos al mismo tiempo
router.get("/download", controller2.getVideo);
router.get("/", controller.getVideoById);
router.post("/upload", controller2.uploadVideo, controller.postVideo);

router.delete("/", authenticateToken);
module.exports = router;
