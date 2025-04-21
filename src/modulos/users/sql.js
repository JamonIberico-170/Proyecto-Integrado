const dbconnect = require("../../DB/dbconnect");

const conexion = dbconnect.conexion;

//Métodos gets para la tabla user

function get() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM user";
    conexion.query(query, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

// function getUser(id) {
//   return new Promise((resolve, reject) => {
//     const query =
//       "SELECT username, nickname, profile_image, num_followers, num_following FROM user WHERE id = ?";
//     conexion.execute(query, [id], (error, result) => {
//       if (error) reject(error);
//       else resolve(result);
//     });
//   });
// }
function getUserByNick(nickname) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT username, nickname, profile_image, num_followers, num_following FROM user WHERE nickname = ?";
    conexion.execute(query, [nickname], (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}
function getUserByName(username, offset) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM user where username LIKE ? LIMIT 10 OFFSET ${offset}`;

    conexion.execute(query, [`%${username}%`], (error, result) => {
      if (error) reject(error);
      else resolve(result);
      console.log(result);
    });
  });
}
function getPassword(nickname) {
  return new Promise((resolve, reject) => {
    const query = `SELECT passwrd FROM user where nickname = ?`;

    conexion.execute(query, [nickname], (error, result) => {
      if (error) reject(error);
      else 
        resolve(result);
    });
  });
}
//Método post para la tabla user

function postUser(username, nickname, email, password, profile_image) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO user (username, nickname, email, passwrd, profile_image) VALUES(?,?,?,?,?)";
    conexion.execute(
      query,
      [username, nickname, email, password, profile_image || null],
      (error, result) => {
        if (error) {
          reject(error);
          conexion.rollback();
        } else
          resolve({
            result,
            data: { id: result.insertId, nickname: nickname },
          });
      }
    );
  });
}

//Métodos put para la tabla user

function putUser(parametros, consultas) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE user SET ${consultas.join(", ")} WHERE id = ?`;
    conexion.execute(query, parametros, (error, result) => {
      if (error) {
        reject(error);
        conexion.rollback();
      } else resolve(result);
    });
  });
}

//Método delete para la tabla user

function deleteUser(id) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM user WHERE id = ?";
    conexion.execute(query, [id], (error, result) => {
      if (error) {
        reject(error);
        conexion.rollback();
      } else resolve({ mensaje: "El usuario ha sido eliminado con éxito." });
    });
  });
}

module.exports = {
  get,
  getUserByName,
  getPassword,
  postUser,
  putUser,
  deleteUser,
  getUserByNick,
};
