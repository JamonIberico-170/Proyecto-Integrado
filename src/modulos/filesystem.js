const fs = require("fs");
const path = require("path");
const multer = require("multer");

async function getImage(req, res) {
  const { url } = req.body;
  console.log(`Esta es la url ${url}`);
  if (!url) {
    console.log("No se ha encontrado la ruta del archivo");
    return res.json({
      message: "No se ha encontrado la ruta del archivo",
      success: false,
    });
  }

  console.log("Entra al menos");

  const uploadPath = path.resolve(__dirname, "../../", url);
  console.log(uploadPath);

  if (!uploadPath) {
    return res.json({ message: "Faltan parámetros.", success: false });
  }

  try {
    await fs.promises.access(uploadPath, fs.constants.F_OK);
    //console.log(res.sendFile('uploadPath'));
    return res.sendFile(uploadPath);
  } catch (err) {
    console.error("Archivo no encontrado:", uploadPath);
    return res.json({ message: "Miniatura no encontrada.", success: false });
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { nickname } = req.body;

    if (!nickname) {
      next();
    }

    const uploadPath = path.join(__dirname, "../../uploads", nickname);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = "profile" + ext;
    const { nickname } = req.body;

    req.body.profileimageurl = path.join("uploads", nickname, filename);

    cb(null, filename); 
  },
});

const upload = multer({ storage });

const uploadProfileImage = [
  upload.single("profile_image"),

  (req, res, next) => {
    const { nickname } = req.body;
    console.log(`nickname : ${nickname}   req.file : ${req.file}`);
    if (!nickname || !req.file) {
      return next();
    }
    console.log("Imagen de perfil guardada en:", req.profileImagePath);
    next();
  },
];


module.exports = {
  getImage,
  uploadProfileImage
};
