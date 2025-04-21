const dbconnect = require("../../DB/dbconnect");
const conexion = dbconnect.conexion;

//Métodos gets para la tabla video

function getRandomVideo() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM video";
    conexion.query(query, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

function getComments(){
  return new Promise((resolve, reject)=>{
    const query = "SELECT * "
  })
}

module.exports = {
    getRandomVideo
}