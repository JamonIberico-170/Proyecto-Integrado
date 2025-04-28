const dbconnect = require("../../DB/dbconnect");
const conexion = dbconnect.conexion;

function getShared(userId, offset) {
  return new Promise((resolve, reject) => {
    const query = `SELECT video_id FROM share WHERE user_id = ? LIMIT 10 OFFSET ${offset}`;

    conexion.execute(query, [userId], (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

module.exports = {
    getShared
}