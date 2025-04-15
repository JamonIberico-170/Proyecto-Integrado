const { off } = require("../../app");
const consultas = require("./sql");
const respuestas = require("../../red/respuestas");
async function get() {
  try {
    return await consultas.get();
  } catch (error) {
    console.log(error);
  }
}

async function getUser(userId) {
  try {
    const resultado = await consultas.getUser(userId);

    if (resultado.length > 0) return resultado;
    else return "User not found";
  } catch (error) {
    console.log(error);
  }
}
async function getUserByName(username, offset=2) {
  try {
    const parsedOffset = parseInt(offset, 10);
    
    //Si parsedOffset no es un número, devuelve un error y detiene la función.
    if (isNaN(parsedOffset) || parsedOffset < 0) {
      return reject(
        new Error(
          "El offset debe ser un número entero válido y mayor o igual a 0."
        )
      );
    } 
    const resultado = await consultas.getUserByName(username, parsedOffset);
    if (resultado.length > 0) return resultado;
    else return "User not found";
  } catch (error) {
    console.log(error);
  }
}

async function postUser(username, email, password, profile_image) {
  try {


    const resultado = await consultas.postUser(username, email, password, profile_image);
    if (resultado) return resultado;
  } catch (error) {
    console.log(error);
  }
}

async function putUser(username, password, profile_image, userid){
  try{
    const parametros = [];
    const modificadores = [];

   
    if(!username){
      parametros.push(username);
      modificadores.push('username = ?');
    }
    if(!password){
      parametros.push(password);
      modificadores.push('password = ?');
    }
    if(!profile_image){
      parametros.push(profile_image);
      modificadores.push('profile_image = ?');
    }
    if(!userid){
      parametros.push(userid);
      const resultado = await consultas.putUser(username, password, profile_image, userid);
      if(resultado) return resultado;
    }
    else return "Error, no se ha proporcionado el id del user";
      
    
  }catch(error){
    console.log(error);
  }
}


async function deleteUser (userId){
  try{
    
    if(!userId)
      return respuestas.error(req,res,"Bad request", 400);
    else {
      const resultado = await consultas.deleteUser(userId);
      if(resultado) return resultado;
    }
  }catch(error){
    console.log(error);
  }
}



module.exports = {
  get,
  getUser,
  getUserByName,
  postUser,
  putUser,
  deleteUser
};
