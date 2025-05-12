const consultas = require("./sql");
const respuestas = require("../../red/respuestas");
const utilities = require("../../utils/utils");
const auth = require("../../auth/auth");
const { conexion } = require("../../DB/dbconnect");

async function getCommentsVideo(req, res) {
  try {
    const { videoid } = req.body;

    if (!videoid) {
      return res.json({
        message: "No se ha encontrado el video",
        success: false,
      });
    }

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
    const resultado = await consultas.getCommentsVideo(videoid, offset);

    return res.json(resultado);
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Error al obtener los comentarios.",
      success: false,
    });
  }
}

async function postComment(req, res) {
  try {
    const { videoid } = req.body;
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

    const resultado = await consultas.getComments();

    if (!resultado)
      return res.json({
        message: "No se ha podido subir el comentario.",
        success: false,
      });
    return res.json({ message: "Se ha comentado con éxito.", success: true });
  } catch (error) {
    console.log(error);
    conexion.rollback();
  }
}

async function deleteComment(req, res) {
  try {
    const { commentid } = req.body;

    if (!commentid)
      return res.json({ message: "No se ha encontrado el comentario." });

    const resultado = await consultas.deleteComments(commentid);

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
  }
}

module.exports = {
    getCommentsVideo,
    postComment,
    deleteComment
}