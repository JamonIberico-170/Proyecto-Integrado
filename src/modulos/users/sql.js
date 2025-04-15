const { off } = require("../../app");
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

function getUser(idUser) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM user WHERE id=?";
    conexion.execute(query, [idUser], (error, result) => {
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

//Método post para la tabla user

function postUser(username, email, password, profile_image) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO user (username, email, passwrd, profile_image) VALUES(?,?,?,?)";
    conexion.execute(
      query,
      [username, email, password, profile_image || null],
      (error, result) => {
        if (error) {
          reject(error);
          conexion.rollback();
        } else resolve(result);
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

function deleteUser(userId) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM user WHERE id=?";
    conexion.execute(query, [userId], (error, result) => {
      if (error) {
        reject(error);
        conexion.rollback();
      } else resolve(result);
    });
  });
}

module.exports = {
  get,
  getUser,
  getUserByName,
  postUser,
  putUser,
  deleteUser
};
