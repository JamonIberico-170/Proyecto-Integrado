/*const db = require('../../DB/dbconnect');

const TABLA = 'video';


function todos(){
    return db.todos(TABLA);
}
module.exports = {
    todos
}*/

const consultas = require("./sql");
const respuestas = require("../../red/respuestas");
const utilities = require("../../utils/utils");
const auth = require("../../auth/auth");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

async function getRandomVideo(req, res) {
  try {
    const resultado = await consultas.getRandomVideo();

    const video = {
      consulta: resultado,
      video: "s",
    };
    return res.json(video);
  } catch (error) {
    console.log(error);
  }
}

async function postVideo(req, res) {
  try {
    const { nickname } = req.body;
    console.log(req.body);
    const uploadPath = path.join(__dirname, `uploads/${nickname}/`);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, `uploads/${nickname}/`);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext); //¿Cómo quedaría? : NombreDelVideo-FechaActual-NúmeroAleatorio.ExtensiónDelArchivo
      },
    });

    const upload = multer({ storage: storage }).single("video");

    // Ahora ejecutamos el middleware pasando req, res y cb
    upload(req, res, function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send("Error al subir el video");
      }

      console.log("Archivo subido a:", req.file.path);
      res.status(200).send("Video subido correctamente");
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  postVideo,
};
