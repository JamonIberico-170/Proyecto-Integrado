const multer = require("multer");
const fs = require('fs');
const { success } = require("../../red/respuestas");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { nickname } = req.body;

    if (!nickname) {
      return cb(new Error("Falta el campo 'nickname'"));
    }

    const uploadPath = path.join(__dirname, "../../../uploads", nickname);
    
    if (!fs.existsSync(uploadPath)) {
      console.log(uploadPath);
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const finalName = file.fieldname + "-" + uniqueSuffix + ext;
    cb(null, finalName);
  }
});

const upload = multer({ storage: storage });

const uploadVideo = [
  upload.single('video'), 
  (req, res, next) => {         
    if (!req.body.nickname || !req.body.user_id) {
      return res.json({message: "Falta el campo 'nickname'", success : false});
    }

    if (!req.file) {
      return res.json({message: "No se recibió ningún archivo", success: false});
    }

    console.log("Archivo subido en:", req.file.path);
    next();
  }
];


async function getVideo(req, res) {

  const {route} = req.body;

  const uploadPath = path.resolve(__dirname, '../../..', route);

  if (!uploadPath) 
    return res.json({ message: "Faltan parámetros.", success : false});

  // Verificamos si el vídeo existe
  fs.access(uploadPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Archivo no encontrado:", uploadPath);
      return res.json({ message: "Video no encontrado.", success: true });
    }

    res.sendFile(uploadPath);
  });
}

async function getVideo2(route) {


  const uploadPath = path.resolve(__dirname, '../../..', route);

  if (!uploadPath) 
    return res.json({ message: "Faltan parámetros.", success : false});

  // Verificamos si el vídeo existe
  fs.access(uploadPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Archivo no encontrado:", uploadPath);
      return res.json({ message: "Video no encontrado.", success: true });
    }

    res.sendFile(uploadPath);
  });
}
module.exports = {
  uploadVideo,
  getVideo,
  getVideo2
};
