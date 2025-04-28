const consultas = require("./sql");
const respuestas = require("../../red/respuestas");
const utilities = require("../../utils/utils");
const auth = require("../../auth/auth");
const controller2 = require("../users/controller");
const { off } = require("../../app");

async function getSharedByUser(req, res) {
  try {
    const { nickname, offset } = req.body;

    //#region  Verifica las variables
    if (!nickname)
      return res.json({
        message: "No se ha proporcionado ningún nickname.",
        success: false,
      });
    const resultado = await controller2.getIdByNickname(nickname);

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

    if (resultado.length == 0)
      return res.json({
        message: "No se ha encontrado ningún usuario con ese nickname.",
        success: true,
      });
    const { id } = resultado;

    const sharedVideos = await consultas.getShared(id, offset);

    //Aquí iría la función que te devuelve la miniatura del video y el id con el url del video
    return res.json(resultado);
  } catch (error) {
    console.log(error);
  }
}

async function getSharedByVideo(req, res) {}

module.exports = {
  getSharedByUser,
};
