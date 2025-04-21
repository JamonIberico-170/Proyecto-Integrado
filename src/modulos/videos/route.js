const express = require("express");
const controller = require("./controller");
const router = express.Router();
const { authenticateToken } = require("../../auth/auth");

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
//router.post('/',  authenticateToken, controller.postVideo);

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const baseUploadPath = path.join(__dirname, "uploads", "temp"); // carpeta temporal
      if (!fs.existsSync(baseUploadPath)) {
        fs.mkdirSync(baseUploadPath, { recursive: true });
      }
      cb(null, baseUploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
  });

const upload = multer({ storage: storage });

// Ruta con middleware de multer correctamente ejecutado
router.post("/upload", upload.single("video"), (req, res) => {
    const { nickname } = req.body;
  
    if (!nickname) {
      return res.status(400).send("Falta el campo 'nickname'");
    }
  
    const oldPath = req.file.path;
    const newDir = path.join(__dirname, "../../../uploads", nickname);
    const newPath = path.join(newDir, req.file.filename);
  
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }
  
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error("Error al mover el archivo:", err);
        return res.status(500).send("Error al mover el archivo");
      }
  
      console.log("Archivo subido y movido a:", newPath);
      res.send("Video subido correctamente");
    });
  });

router.delete("/", authenticateToken);
module.exports = router;
