/*
    Rutas:
    -> Una para obtener un usuario en específico
    -> Una para obtener los videos a los que se les han dado like
    -> Una para obtener los vídeos a los que se les ha dada fav

    function validateIdUser(req, res, next) {
  if (!/^\d+$/.test(req.params.idUser)) {
    return res.status(400).json({ error: 'idUser debe ser un número.' });
  }
  next();
}

// Middleware para validar que username es una cadena (solo letras y números, por ejemplo)
function validateUsername(req, res, next) {
  if (!/^[a-zA-Z0-9]+$/.test(req.params.username)) {
    return res.status(400).json({ error: 'username debe ser una cadena alfanumérica.' });
  }
  next();
}

*/
const express = require("express");
const controller = require("./controller");
const router = express.Router();
const { authenticateToken } = require("../../auth/auth");

router.get("/", authenticateToken, (req, res) => {
  controller.get().then((resultado) => {
    res.json(resultado);
  });
});

router.get("/id/:idUser", (req, res) => {
  controller.getUser(req.params.idUser).then((resultado) => {
    res.json(resultado);
  });
});

router.get("/username/:username", (req, res) => {
  controller.getUserByName(req.params.username).then((resultado) => {
    res.json(resultado);
  });
});

router.post("/", (req, res) => {
  const { username, email, password, profile_image } = req.body;
  controller
    .postUser(username, email, password, profile_image)
    .then((resultado) => {
      res.json(resultado);
    });
});

router.put("/", (req, res) => {
  const { username, password, profile_image, id } = req.body;
  controller
    .putUser(username, password, profile_image, id)
    .then((resultado) => {
      res.json(resultado);
    });
});

module.exports = router;
