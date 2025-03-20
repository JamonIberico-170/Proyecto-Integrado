const express = require('express');

const respuesta = require('../../red/respuestas.js');
const controlador = require('./controller.js');

const router = express.Router();

router.get('/', function (req, res){
    const todo = controlador.todos();
    respuesta.success(req, res, 'Todo OK '+todo, 200);
});

module.exports=router; 