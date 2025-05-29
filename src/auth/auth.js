const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    console.log("NO se ha proporcionado el token");
    return res
      .status(401)
      .json({ message: "Acceso denegado. Token no proporcionado." });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido." });
    }
    req.user = user;
    next();
  });
}

function createToken(data) {
  const { id, nickname } = data;
  console.log(`id : ${id}, nickname : ${nickname}`);
  if (!id || !nickname) {
    return {
      message: "Nickname o id no proporcionados.",
      success: false,
    };
  }
  const token = jwt.sign(
    { id: id, nickname: nickname, role: "user" },
    process.env.JWT_SECRET,
    
  );

  return { message: "Autenticación exitosa", success : true, token: token };
}

module.exports = {
  authenticateToken,
  createToken,
};
