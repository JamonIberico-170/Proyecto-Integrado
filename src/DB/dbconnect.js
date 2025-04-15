const mysql = require("mysql2");
const config = require("../config");

const conexion = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
});

conexion.connect((err) => {
  if (err) console.log(err) ;
  else console.log("Base de datos conectada con éxito.");
});

conexion.on("error", (err) => {
  console.log("[db error]", err);
  if (err.code == "PROTOCOL_CONNECTION_LOST") connectToDatabase();
  else console.log(err);
});

module.exports.conexion = conexion;