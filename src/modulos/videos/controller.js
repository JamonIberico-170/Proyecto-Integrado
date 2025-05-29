const aux = require("./filesystem");
const consultas = require("./sql");
const utilities = require("../../utils/utils");
const logger = require("../../utils/logger");

async function get5RandomVideo(req, res) {
  try {
    const resultado = await consultas.get5RandomVideo();
    if (resultado) {
      //logger.info(JSON.stringify(resultado));
      return res.json(resultado);
    } else
      return res.json({
        message: "Ha habido un problema al solicitar los videos.",
        success: false,
      });
  } catch (error) {
    logger.error(error);
    return res.json({ message: "Error", success: false });
  }
}

async function getVideoById(req, res) {
  try {
    const { videoId } = req.body;
    const id = req.user.id;
    if (!videoId)
      return res.json({ message: "No se ha encontrado el id", success: false });

    const resultado = await consultas.getVideoById(videoId, id);
    //console.log(resultado);
    return res.json(resultado);
  } catch (error) {
    logger.error(error);
    return res.json({ message: "Error", success: false });
  }
}

async function getVideoByURL(url) {
  try {
    const { url } = req.query;
    const resultado = await consultas.getVideoByURL(url);
    return res.json();
  } catch (error) {
    logger.error(error);
    return res.json({ message: "Error", success: false });
  }
}

async function postVideo(req, res) {
  try {
    const { title } = req.body;
    const user_id = req.user.id;
    const urlVideo = utilities.generateURL(req.files["video"][0].path);

    const urlThumbnail = req.files["thumbnail"]
      ? utilities.generateURL(req.files["thumbnail"][0].path)
      : undefined;

    console.log({ user_id, title, urlVideo, urlThumbnail });
    const resultado = await consultas.postVideo(
      urlVideo,
      urlThumbnail,
      user_id,
      title
    );

    if (resultado)
      return res.json({
        message: "Video subido con éxito.",
        success: true,
        resultado,
      });
    else
      return res.json({
        message: "Error al subir el vídeo.",
        success: false,
        resultado,
      });
  } catch (error) {
    logger.error(error);
    return res.json({ message: "Error", success: false });
  }
}

async function deleteVideo(req, res) {
  try {
    const { videoid } = req.query;
    const userid = req.user.id;
    console.log(`ID : ${videoid} USERID : ${userid}`);
    if (!videoid)
      return res.json({
        message: "No se ha encontrado el vídeo.",
        success: false,
      });
    if (!userid)
      return res.json({
        message: "No se ha encontrado el usuario.",
        success: false,
      });

    const resultado = await consultas.deleteVideo(videoid, userid);
    req.url.url = resultado[0].url;
    aux.deleteVideo(resultado[0].url);
    return res.json({ s: "Video eliminado con éxito.", success: true });
    //deleteVideo
  } catch (error) {
    logger.error(error);
    return res.json({ message: "Error", success: false });
  }
}
module.exports = {
  get5RandomVideo,
  getVideoById,
  postVideo,
  getVideoByURL,
  deleteVideo,
};
