const consultas = require("./sql");
const respuestas = require("../../red/respuestas");
const utilities = require("../../utils/utils");
const auth = require("../../auth/auth");

async function getCommentsVideo(req, res){
    try{
        
    }catch(error){
        console.log(error);
        return res.json({message : "Error al obtener los comentarios.", success: false});
    }
}