const dbconnect = require("../../DB/dbconnect");
const conexion = dbconnect.conexion;

function getShared(nickname, offset = 0) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT video.id as video_id, video.url as url, video.thumbnail, video.title," +
      "video.num_comment as comments, video.num_likes as likes, video.num_fav as favs, video.num_share as shares," +
      "user.username, user.profile_image as image " +
      "FROM share " +
      "LEFT JOIN user ON share.user_id = user.id " +
      "LEFT JOIN video ON share.video_id = video.id " +
      `WHERE user.nickname = ? LIMIT 10 OFFSET ${offset}`;
    conexion.execute(query, [nickname], (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

function postShared(userId, videoId) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO share (user_id, video_id) VALUES (?,?)";
    conexion.execute(query, [userId, videoId], (error, result) => {
      if (error) {
        conexion.rollback();
        reject(error);
      } else resolve(result);
    });
  });
}

function deleteShared(userId, videoId) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM share where user_id = ? and video_id = ?";
    conexion.execute(query, [userId,videoId], (error, result) => {
      if (error) {
        conexion.rollback();
        reject(error);
      } else resolve(result);
    });
  });
}
module.exports = {
  getShared,
  postShared,
  deleteShared
};
