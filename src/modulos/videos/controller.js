const aux = require('./filesystem');
const consultas = require("./sql");
const respuestas = require("../../red/respuestas");
const utilities = require("../../utils/utils");
const auth = require("../../auth/auth");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { use } = require('./route');

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

async function getVideoById(req, res){
  try{
    const {id} = req.body;
    if(!id)
      return res.json({message: "No se ha encontrado el id", success : false});
    
    const resultado = await consultas.getVideoById(id);
    console.log(resultado);
    return res.json(resultado);
  }catch(error){
    console.log(error);
    return res.json({ message: "Error", success: false });
  }
}

async function getVideoByURL(url){
  try{
    const {url} = req.query;
    const resultado = await consultas.getVideoByURL(url);
    return res.json()
  }catch(error){
    console.log(error);
    return res.json({ message: "Error", success: false });
  }
}


async function postVideo(req, res) {
  try {
    const {title} = req.body;
    const user_id = req.user.id;
    const urlVideo = utilities.generateURL(req.files["video"][0].path);
    
    const urlThumbnail = req.files["thumbnail"] ? utilities.generateURL(req.files["thumbnail"][0].path) : undefined;

    console.log({user_id, title, urlVideo, urlThumbnail});
    const resultado = await consultas.postVideo(urlVideo, urlThumbnail, user_id, title);
    
    if(resultado)
      return res.json({message: "Video subido con éxito.", success: true, resultado})
    else 
      return res.json({message : "Error al subir el vídeo.", success : false, resultado});
    
  } catch (error) {
    console.log(error);
  }
}

async function deleteVideo(req, res){
  try{
    const {id} = req.body;
    const userid = req.user.id;

    if(!id)
      return res.json({message : "No se ha encontrado el vídeo.", success : false});
    if(!userid)
      return res.json({message : "No se ha encontrado el usuario.", success : false});

    const resultado = await consultas.deleteVideo(id, userid)
    req.url.url = resultado[0].url;
    aux.deleteVideo(resultado[0].url);
    return res.json({s : "Video eliminado con éxito.", success : true});
    //deleteVideo
    
  }catch(error){

  }
}
module.exports = {
  getVideoById,
  postVideo,
  getVideoByURL,
  deleteVideo
};
