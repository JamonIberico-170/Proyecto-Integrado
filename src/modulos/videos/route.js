const express = require('express');

const respuesta = require('../../red/respuestas.js');
const controlador = require('./controller.js');

const router = express.Router();

/*
    Rutas:
    -> Una para obtener un video en específico
    -> Una para obtener un video al azar
    -> Una para obtener un lista de videos
    
    ->

*/
router.get('/', function (req, res){
    const todo = controlador.todos();
    respuesta.success(req, res, 'Todo OK '+todo, 200);
});

router.get('/randomvideo', function (req,res){
    const result="";
    
});
module.exports=router; 