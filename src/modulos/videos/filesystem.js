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
    if (!req.body.nickname || !req.user.id) {
      console.log("Falta el campo nickname")
      return res.json({ message: "Falta el campo 'nickname'", success: false });
    }

    if (!req.files["video"]) {
      console.log("Falta el video");
      return res.json({
        message: "No se encuentra el archivo de video",
        success: false,
      });
    }

    console.log("Video subido en:", req.files["video"][0].path);
    if (req.files["thumbnail"])
      console.log("Thumbnail subido en:", req.files["thumbnail"][0].path);
    next();
  },
];

var veces = 0;
async function getVideo(req, res) {
  const { url } = req.query;
  veces = veces + 1;
  console.log(`Petición Entrante Nº: ${veces}. URL : ${url}`);
  if (!url) {
    console.log("No se ha proporcionado la ruta del video");
    return res.status(400).json({
      message: "No se ha proporcionado la ruta del vídeo.",
      success: false,
    });
  }
  const videoPath = path.resolve(__dirname, "../../..", url);

  try {
    await fs.promises.access(videoPath, fs.constants.F_OK);
  } catch (err) {
    console.error("Archivo no encontrado:", videoPath);
    return res
      .status(404)
      .json({ message: "Vídeo no encontrado.", success: false });
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res
        .status(416)
        .send(
          "El rango solicitado no es satisfacible\n" + start + " >= " + fileSize
        );
      console.log("El rango solicitado no es satisfacible");
      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
      "Content-Disposition": `inline; filename="${path.basename(videoPath)}"`, // Sugiere un nombre para el archivo
    };

    res.writeHead(206, head); // 206 Partial Content
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
      "Content-Disposition": `inline; filename="${path.basename(videoPath)}"`, // Sugiere un nombre para el archivo
    };
    res.writeHead(200, head); // 200 OK
    fs.createReadStream(videoPath).pipe(res);
  }
}

async function deleteVideo(url) {
  if (!url) {
    console.log("No se ha proporcionado la ruta.");

    return null;
  }
  const finalRoute = path.dirname(url);
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
module.exports = {
  uploadVideo,
  getVideo,
  getVideoURL,
  // getVideo2,
  deleteVideo,
};
