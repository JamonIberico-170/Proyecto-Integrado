const dbconnect = require("../../DB/dbconnect");
const conexion = dbconnect.conexion;

function getFav(nickname, offset = 0) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT video.id as video_id, video.url as url, video.thumbnail, video.title," +
      "video.num_comment as comments, video.num_likes as likes, video.num_fav as favs, video.num_share as shares," +
      "user.username, user.nickname, user.profile_image as image, " +
      "'TRUE' AS isSaved, "+
      "CASE WHEN EXISTS ( SELECT 1 FROM likes  WHERE likes.user_id = user.id AND likes.video_id = video.id ) THEN 'TRUE' "+
      "ELSE 'FALSE' END AS isLiked "+
      "FROM fav " +
      "LEFT JOIN user ON fav.user_id = user.id " +
      "LEFT JOIN video ON fav.video_id = video.id " +
      `WHERE user.nickname = ? LIMIT 10 OFFSET ${offset}`;
    conexion.execute(query, [nickname], (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

function postFav(userId, videoId) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO fav (user_id, video_id) VALUES (?,?)";
    conexion.execute(query, [userId, videoId], (error, result) => {
      if (error) {
        conexion.rollback();
        reject(error);
      } else resolve(result);
    });
  });
}

function deleteFav(userId, videoId) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM fav where user_id = ? and video_id = ?";
    conexion.execute(query, [userId,videoId], (error, result) => {
      if (error) {
        conexion.rollback();
        reject(error);
      } else resolve(result);
    });
  });
}

module.exports = {
  getFav,
  postFav,
  deleteFav
};
