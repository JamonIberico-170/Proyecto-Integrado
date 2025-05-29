const consultas = require("./sql");
const logger = require("../../utils/logger");

async function getCommentsVideo(req, res) {
  try {
    
    const { videoid, offset } = req.body;
    var parsedOffset = 0;
    if (!videoid) {
      logger.warn("No se ha encontrado el video.");
      return res.json({
        message: "No se ha encontrado el video",
        success: false,
      });
    }

    if (offset === undefined) parsedOffset = parseInt(0, 10);
    else parsedOffset = parseInt(offset, 10);

    //Si parsedOffset no es un número, devuelve un error y detiene la función.
    if (isNaN(parsedOffset) || parsedOffset < 0) {
      logger.warn("El offset debe de ser un número entero válido y mayor o igual a 0.");
      return reject(
        new Error(
          "El offset debe ser un número entero válido y mayor o igual a 0."
        )
      );
    }
    const resultado = await consultas.getComments(videoid, parsedOffset);

    console.log(resultado);
    logger.info(resultado);
    return res.json(resultado);
  } catch (error) {
    logger.error(error);
    return res.json({
      message: "Error al obtener los comentarios.",
      success: false,
    });
  }
}

async function postComment(req, res) {
  try {
    const { videoid, comment } = req.body;
    const id = req.user.id;

    if (!videoid) {
      return res.json({
        message: "No se ha encontado el video.",
        success: false,
      });
    }
    if (!id) {
      return res.json({
        message: "No se ha identificado el id.",
        success: false,
      });
    }
    if(!comment){
      return res.json({
        message: "No se ha encontado el comentario.",
        success: false,
      });
    }

    const resultado = await consultas.postComments(id, videoid, comment);

    if (!resultado)
      return res.json({
        message: "No se ha podido subir el comentario.",
        success: false,
      });
    return res.json({ message: "Se ha comentado con éxito.", success: true });
  } catch (error) {
    logger.error(error);
    return res.json({ message: "Error al subir el comentario.", success: false });
  }
}

async function deleteComment(req, res) {
  try {
    const { commentid } = req.query;
    
    console.log(commentid);
    if (!commentid)
      return res.json({ message: "No se ha encontrado el comentario." });

    const resultado = await consultas.deleteComments(commentid);
    console.log(resultado);
    if (!resultado)
      return res.json({
        message: "No se ha podido eliminar el comentario.",
        success: false,
      });
    return res.json({
      message: "Se ha eliminado el comentario con éxito.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.json({ message: "Error al eliminar el comentario.", success: false });
  }
}

module.exports = {
    getCommentsVideo,
    postComment,
    deleteComment
}