const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso denegado. Token no proporcionado." });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido." });
    }
  });
  next();
}

function createToken(res, req) {
  console.log(req.body);
  const { id, username } = req.body;

  if (!id || !username) {
    return res
      .status(401)
      .json({ message: "Nombre de usuario o id no proporcionados." });
  }
  const token = jwt.sign(
    { userId: id, username: username },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d", // Puede ser '1h', '7d', etc.
    }
  );

  res.json({ message: "Autenticación exitosa", token: token });
}

module.exports = {
  authenticateToken,
  createToken,
};
