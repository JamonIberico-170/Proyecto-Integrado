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

function getVideoById(videoID) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT video.user_id as video_id, video.url as url, video.thumbnail, video.title," +
      "video.num_comment as comments, video.num_likes as likes, video.num_fav as favs, video.num_share as shares," +
      "user.id as user_id, user.username, user.profile_image as image " +
      "FROM user LEFT JOIN video ON video.user_id = user.id WHERE video.id = ?";

    conexion.query(query, [videoID], (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

function postVideo(url, thumbnail, user_id, title) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO video (url, thumbnail, user_id, title) values (?,?,?,?)";

    conexion.execute(
      query,
      [url, thumbnail || "defecto", user_id, title],
      (error, result) => {
        if (error) {
          conexion.rollback();
          reject(error);
        } else resolve(result);
      }
    );
  });
}

function deleteVideo(videoid, userid){
  return new Promise((resolve, reject)=> {
    const query2 = "SELECT url FROM video WHERE id = ?";
    var aux;
    conexion.execute(query2, [videoid], (error, result)=> {
      if(error)reject(error);
        else aux = result;
      }
    );
    const query = "DELETE FROM video WHERE id = ? AND user_id = ?";
    conexion.execute(query, [videoid, userid], (error, result)=>{
      if(error){
        conexion.rollback();
        reject(error);
      }else
      resolve(aux);
    });
  });
}
module.exports = {
  getRandomVideo,
  getVideoById,
  postVideo,
  deleteVideo
};
