const consultas = require("./sql");
const logger = require("../../utils/logger");

async function getLikedByUser(req, res) {
  try {
    const { nickname, offset } = req.body;
    //#region  Verifica las variables
    if (!nickname)
      return res.json({
        message: "No se ha proporcionado ningún nickname.",
        success: false,
      });

    if (offset === undefined) parsedOffset = parseInt(0, 10);
    else parsedOffset = parseInt(offset, 10);

    //Si parsedOffset no es un número, devuelve un error y detiene la función.
    if (isNaN(parsedOffset) || parsedOffset < 0) {
      return reject(
        new Error(
          "El offset debe ser un número entero válido y mayor o igual a 0."
        )
      );
    }
    //#endregion

    const likedVideos = await consultas.getLiked(nickname, offset);
    //logger.info(JSON.stringify(likedVideos));

    return res.json(likedVideos);
  } catch (error) {
    logger.error(error);
    return res.json({
      message: "Error al obtener de Me gustan.",
      success: false,
    });
  }
}

async function postLiked(req, res) {
  try {
    const { userid: targetid, videoid } = req.body;
    const isAdmin = req.user.role === "admin";

    const userid = isAdmin ? targetid : req.user.id;

    if (!userid || !videoid) {
      return res.json({
        message: "No se ha encontrado el video o el usuario.",
        success: false,
      });
    }

    const resultado = await consultas.postLiked(userid, videoid);
    if (resultado)
      return res.json({ message: "Se ha añadido con éxito.", success: true });
    else return res.json({ message: "Ha habido un problema.", success: false });
  } catch (error) {
    logger.error(error);
    return res.json({
      message: "Error al añadir a Me gustan.",
      success: false,
    });
  }
}

async function deleteLiked(req, res) {
  try {
    const { videoId } = req.query;
    const userid = req.user.id;
    console.log("hola");
    logger.info(
      `Trying delete a like. User : ${userid} . Video : ${videoId} .`
    );

    if (!videoId) {
      logger.warn("Video id is not found.");
      return res.json({
        message: "No se ha encontrado el id del video.",
        success: false,
      });
    }
    if (!userid) {
      logger.warn("User id is not found.");
      return res.json({
        message: "No se ha encontrado el id del usuario.",
        success: false,
      });
    }

    const resultado = await consultas.deleteLiked(userid, videoId);

    if (resultado) {
      logger.info("Like delete succesfully.");
      return res.json({ message: "Se ha eliminado con éxito.", success: true });
    } else {
      logger.warn("Like couldn't be deleted.");
      return res.json({ message: "Error.", success: false });
    }
  } catch (error) {
    logger.error(error);
    return res.json({
      message: "Error al eliminar de Me gustan.",
      success: false,
    });
  }
}

module.exports = {
  getLikedByUser,
  postLiked,
  deleteLiked,
};
