const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const { nickname } = req.body;
      const randomURL = req.url;
      console.log(req.body);
      if (!nickname) {
        return cb(new Error("Falta el campo 'nickname'"));
      }

      const uploadPath = path.join(
        __dirname,
        "../../../uploads",
        nickname,
        randomURL
      );

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    } catch (error) {
      console.error(error);
      return cb(error);
    }
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const finalName = file.fieldname + "-" + uniqueSuffix + ext;
    cb(null, finalName);
  },
});

const upload = multer({ storage: storage });

const uploadVideo = [
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  (req, res, next) => {
    console.log(req.files["video"]);
    if (!req.body.nickname || !req.body.user_id) {
      return res.json({ message: "Falta el campo 'nickname'", success: false });
    }

    if (!req.files["video"]) {
      return res.json({
        message: "No se encuentra el archivo de video",
        success: false,
      });
    }

    console.log("Video subido en:", req.files["video"][0].path);
    if (req.files["thumbail"])
      console.log("Thumbnail subido en:", req.files["thumbnail"][0].path);
    next();
  },
];

async function getVideo(req, res) {
  const { route } = req.body;
  if (!route)
    return res.json({
      message: "No se ha encontrado la ruta.",
      success: false,
    });
  const uploadPath = path.resolve(__dirname, "../../..", route);

  if (!uploadPath)
    return res.json({ message: "Faltan parámetros.", success: false });

  // Verificamos si el vídeo existe
  fs.access(uploadPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Archivo no encontrado:", uploadPath);
      return res.json({ message: "Video no encontrado.", success: true });
    }

    res.setHeader("Content-Type", "video/mp4"); // Establecemos el tipo de contenido como video MP4
    res.setHeader(
      "Content-Disposition",
      "inline; filename=" + path.basename(uploadPath)
    ); // Opcional: para sugerir un nombre para el archivo en el navegador

    const videoStream = fs.createReadStream(uploadPath);
    videoStream.pipe(res); // Enviamos el video al cliente
  });
}

async function deleteVideo(route) {
  if (!route) {
    console.log("No se ha proporcionado la ruta.");

    return null;
  }
  const finalRoute = path.dirname(route);
  const uploadPath = path.resolve(__dirname, "../../..", finalRoute);

  // Verificamos si el archivo existe antes de intentar borrarlo
  fs.access(uploadPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Archivo no encontrado:", uploadPath);
      return null;
    }

    // Eliminamos el archivo
    fs.rm(uploadPath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error("Error al eliminar la carpeta:", err);
        return null;
      }
      return null;
    });
  });
}

async function getVideoURL(req, res) {
  const { route } = req.query;

  const uploadPath = path.resolve(__dirname, "../../..", route);

  if (!uploadPath)
    return res.json({ message: "Faltan parámetros.", success: false });

  // Verificamos si el vídeo existe
  fs.access(uploadPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Archivo no encontrado:", uploadPath);
      return res.json({ message: "Video no encontrado.", success: true });
    }

    res.sendFile(uploadPath);
  });
}
// async function getVideo2(route) {
//   const uploadPath = path.resolve(__dirname, "../../..", route);

//   if (!uploadPath)
//     return res.json({ message: "Faltan parámetros.", success: false });

//   // Verificamos si el vídeo existe
//   fs.access(uploadPath, fs.constants.F_OK, (err) => {
//     if (err) {
//       console.error("Archivo no encontrado:", uploadPath);
//       return res.json({ message: "Video no encontrado.", success: true });
//     }

//     res.sendFile(uploadPath);
//   });
// }
module.exports = {
  uploadVideo,
  getVideo,
  getVideoURL,
  // getVideo2,
  deleteVideo,
};
