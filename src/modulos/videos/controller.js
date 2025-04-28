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
    const {url} = req.body;
    const resultado = await consultas.getVideoByURL(url);
    return res.json()
  }catch(error){
    console.log(error);
    return res.json({ message: "Error", success: false });
  }
}


async function postVideo(req, res) {
  try {
    const {thumbnail, user_id, title} = req.body;
    const url = utilities.generateURL(req.file.path);

    console.log({thumbnail, user_id, title, url});
    const resultado = await consultas.postVideo(url, thumbnail, user_id, title);
    
    if(resultado)
      return res.json({message: "Video subido con éxito.", success: true, resultado})
    else 
      return res.json({message : "Error al subir el vídeo.", success : false, resultado});
    
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getVideoById,
  postVideo
};
