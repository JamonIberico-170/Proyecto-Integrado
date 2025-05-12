const consultas = require("./sql");
const respuestas = require("../../red/respuestas");
const utilities = require("../../utils/utils");
const auth = require("../../auth/auth");

async function getFavByUser(req, res) {
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
    
    if (!nickname) {
      return res.json({
        message: "No se ha encontrado ningún nickname.",
        success: true,
      });
    }

    const sharedVideos = await consultas.getFav(nickname, offset);

    return res.json(sharedVideos);
  } catch (error) {
    console.log(error);
  }
}

async function postFav(req, res) {
  try {
    const {userid: targetid, videoid } = req.body;
    const isAdmin = req.user.role === "admin";

   const userid = isAdmin ? targetid : req.user.id;

    if (!userid || !videoid) {
      return res.json({
        message: "No se ha encontrado el video o el usuario.",
        success: false,
      });
    }

    const resultado = await consultas.postFav(userid, videoid);
    if (resultado)
      return res.json({ message: "Se ha añadido con éxito.", success: true });
    else return res.json({ message: "Ha habido un problema.", success: false });
  } catch (error) {
    console.log(error);
  }
}

async function deleteFav(req, res){
    try{
        const {videoid} = req.body;
        const userid = req.user.id;

        if(!videoid){
            return res.json({
                message: "No se ha encontrado el id del video.",
                success: false,
              });
        }
        if(!userid){
            return res.json({
                message: "No se ha encontrado el id del usuario.",
                success: false,
              });
        }

        const resultado = await consultas.deleteFav(userid, videoid);

        if(resultado)
            return res.json({message: "Se ha eliminado con éxito.", success : true});
        else return res.json({message: "Error.", success: false});

    }catch(error){
        console.log(error);
    }
}

module.exports = {
  getFavByUser,
  postFav,
  deleteFav
};