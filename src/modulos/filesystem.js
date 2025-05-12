const fs = require("fs");
const path = require("path");

async function getImage(req, res) {
  const { route } = req.query;
  if (!route) {
    return res.json({
      message: "No se ha encontrado la ruta del archivo",
      success: false,
    });
  }

  const uploadPath = path.resolve(__dirname, "../../", route);
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

module.exports = {
  getImage,
};
