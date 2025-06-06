const dbconnect = require("../../DB/dbconnect");
const conexion = dbconnect.conexion;

function getLiked(nickname, offset = 0) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT video.id as video_id, video.url as url, video.thumbnail, video.title," +
      "video.num_comment as comments, video.num_likes as likes, video.num_fav as favs, video.num_share as shares," +
      "user.username, user.nickname, user.profile_image as image, " +
      "'TRUE' AS isLiked, "+
      "CASE WHEN EXISTS ( SELECT 1 FROM fav  WHERE fav.user_id = user.id AND fav.video_id = video.id ) THEN 'TRUE' "+
      "ELSE 'FALSE' END AS isSaved "+
      "FROM likes " +
      "LEFT JOIN user ON likes.user_id = user.id " +
      "LEFT JOIN video ON likes.video_id = video.id " +
      `WHERE user.nickname = ? LIMIT 10 OFFSET ${offset}`;
    conexion.execute(query, [nickname], (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

function postLiked(userId, videoId) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO likes (user_id, video_id) VALUES (?,?)";
    conexion.execute(query, [userId, videoId], (error, result) => {
      if (error) {
        conexion.rollback();
        reject(error);
      } else resolve(result);
    });
  });
}

function deleteLiked(userId, videoId) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM likes where user_id = ? and video_id = ?";
    conexion.execute(query, [userId,videoId], (error, result) => {
      if (error) {
        conexion.rollback();
        reject(error);
      } else resolve(result);
    });
  });
}
module.exports = {
  getLiked,
  postLiked,
  deleteLiked
};
