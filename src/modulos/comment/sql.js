const dbconnect = require("../../DB/dbconnect");
const conexion = dbconnect.conexion;

function getComments(videoid, offset = 0) {
  return new Promise((resolve, reject) => {
    //Leftjoin con user para pillar el nickname
    const query =
      "SELECT comment.id, comment.text as comment, user.username, user.nickname, comment.date_create " +
      "FROM comment " +
      "LEFT JOIN user ON comment.user_id = user.id " +
      "LEFT JOIN video ON comment.video_id = video.id " +
      `WHERE video.id = ? LIMIT 10 OFFSET ${offset}`;
    conexion.execute(query, [videoid], (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

function postComments(userid, videoid, text) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO comment (user_id,video_id,text) VALUES (?,?,?)";
    conexion.execute(query, [userid, videoid, text], (error, result) => {
      if (error) {
        reject(error);
        conexion.rollback();
      } else resolve(result);
    });
  });
}

function deleteComments(commentid) {
  console.log(`Comment: ${commentid}`);
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM comment WHERE id = ?";
    conexion.execute(query, [commentid], (error, result) => {
      if (error) {
        reject(error);
        conexion.rollback();
      } else resolve(result);
    });
  });
}
module.exports = {
  getComments,
  postComments,
  deleteComments,
};
