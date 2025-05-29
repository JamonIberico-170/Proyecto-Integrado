const consultas = require("./sql");
const respuestas = require("../../red/respuestas");
const utilities = require("../../utils/utils");
const auth = require("../../auth/auth");
const logger = require("../../utils/logger");
const { Console } = require("winston/lib/winston/transports");

//Utilizados en los endpoints
async function getUser(req, res) {
  const id = req.user.id;

  try {
    const resultado = await consultas.getUser(id);

    if (resultado.length > 0) {
      //console.log(resultado[0]);
      return res.json(resultado[0]);
    } else {
      return res.json({
        message: "User not found",
        data: {
          id: id,
        },
      });
    }
  } catch (error) {
    logger.error(error);
    return res.json({ message: "Error", success: false });
  }
}

// async function getUserById(req, res) {
//   const { id } = req.params;
//   const validate = utilities.validateId(id);
//   if (validate) return res.json(validate);
//   try {
//     const resultado = await consultas.getUser(id);
//     if (resultado.length > 0) return res.json(resultado);
//     else {
//       return res.json({
//         message: "User not found",
//         data: {
//           id: id,
//         },
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
async function getUserByNick(req, res) {
  const { nickname } = req.query;
  console.log(nickname);
  if (!nickname)
    return res.json({
      message: "No se ha encontrado el nickname.",
      success: false,
    });

  const validate = utilities.validateNickname(nickname);
  console.log(validate);
  if (validate) return res.json(validate);
  try {
    const resultado = await consultas.getUserByNick(nickname);
    console.log(resultado);
    if (resultado.length > 0) return res.json(resultado[0]);
    else {
      return res.json({
        message: "User not found",
        data: {
          nickname,
        },
      });
    }
  } catch (error) {
    logger.error(error);
    return res.json({
      message: "Error al obtener el usuario.",
      success: false,
    });
  }
}
async function getUserByName(req, res) {
  const { username, offset } = req.query;

  // if (!username)
  //   return res.json({
  //     message: "No se ha encontrado el username.",
  //     success: false,
  //   });

  console.log(`El username ${username}`);
  if (offset === undefined) parsedOffset = parseInt(0, 10);
  else parsedOffset = parseInt(offset, 10);

  try {
    //Si parsedOffset no es un número, devuelve un error y detiene la función.
    if (isNaN(parsedOffset) || parsedOffset < 0) {
      return reject(
        new Error(
          "El offset debe ser un número entero válido y mayor o igual a 0."
        )
      );
    }
    const resultado = await consultas.getUserByName(username, parsedOffset);
    if (resultado.length > 0) return res.json(resultado);
    else
      return res.json({
        message: "User not found",
        data: {
          username: username,
          offset: parsedOffset,
        },
      });
  } catch (error) {
    logger.error(error);
    return res.json({
      message: "Error al obtener el usuario.",
      success: false,
    });
  }
}

async function getFollowingUsers(req, res) {
  try {
    const { nickname } = req.body;

    if (!nickname)
      return res.json({
        message: "No se ha encontrado el nickname.",
        success: false,
      });

    const validate = utilities.validateNickname(nickname);
    if (validate) return res.json(validate);

    const resultado = await consultas.getFollowingUsers(nickname);

    console.log(`Usuarios que sigue : ${JSON.stringify(resultado)}`);
    if (resultado.length > 0) return res.json(resultado);
    else
      return res.json({
        message: "No sigues a nadie, LOL",
        success: true,
      });
  } catch (error) {
    logger.error(error);
    return res.json({
      message: "Error al obtener los seguidos.",
      success: false,
    });
  }
}

async function getFollowers(req, res) {
  try {
    const { nickname } = req.body;

    if (!nickname)
      return res.json({
        message: "No se ha encontrado el nickname.",
        success: false,
      });

    const validate = utilities.validateNickname(nickname);
    if (validate) return res.json(validate);

    const resultado = await consultas.getFollowers(nickname);
    console.log(`Usuarios que le siguen : ${JSON.stringify(resultado)}`);
    if (resultado.length > 0) return res.json(resultado);
    else
      return res.json({
        message: "No te sigue nadie, xD",
        success: true,
      });
  } catch (error) {
    logger.error(error);
    return res.json({
      message: "Error al obtener los seguidores.",
      success: false,
    });
  }
}

async function getUploadVideo(req, res) {
  try {
    const { nickname, offset } = req.body;
    //#region  Verifica las variables
    if (!nickname)
      return res.json({
        message: "No se ha proporcionado ningún nickname.",
        success: false,
      });

    if (offset === undefined) parsedOffset = parseInt(0, 10);
    else parsedOffset = parseInt(offset, 10);

    //Si parsedOffset no es un número, devuelve un error y detiene la función.
    if (isNaN(parsedOffset) || parsedOffset < 0) {
      return reject(
        new Error(
          "El offset debe ser un número entero válido y mayor o igual a 0."
        )
      );
    }
    //#endregion
    const uploadedVideos = await consultas.getUploadVideo(nickname, offset);
    //console.log(uploadedVideos);
    return res.json(uploadedVideos);
  } catch (error) {
    logger.error(error);
    return res.json({
      message: "Error al obtener a los videos subidos.",
      success: false,
    });
  }
}

async function postUser(req, res) {
  const { username, nickname, email, password, profile_image } = req.body;

  //Aquí compruebo el username

  try {
    var validate = utilities.validateName(username);
    if (validate) return res.json(validate);
    validate = utilities.validateNickname(nickname.toLowerCase());
    if (validate) return res.json(validate);
    validate = await utilities.verifyEmail(email);
    if (!validate.success) return res.json(validate);

    //Comprueba si el nombre de usuario o el correo están en uso.
    const reply = await utilities.userExist(nickname.toLowerCase(), email);
    if (!reply.success) return res.json(reply);

    const hashedPassword = await utilities.createHash(password);

    const resultado = await consultas.postUser(
      username,
      nickname.toLowerCase(),
      email.toLowerCase(),
      hashedPassword,
      profile_image
    );

    if (resultado) {
      const token = auth.createToken(resultado.data);
      const enviar = {
        token: token.token,
        id: await consultas.getIdByNickname(nickname)[0],
      };
      console.log(enviar);
      console.log(token);
      return res.json(enviar);
    } else {
      return res.json({
        message: "No se pudo registrar el usuario.",
        success: false,
      });
    }
  } catch (error) {
    logger.error(error);
    return res.json({ message: "Error al crear un usuario.", success: false });
  }
}

async function loginUser(req, res) {
  const { nickname, password } = req.body;

  if (!nickname)
    return res.json({
      message: "No se ha proporcionado el username.",
      success: false,
    });

  if (!password)
    return res.json({
      message: "No se ha proporcionado la constraseña.",
      success: false,
    });

  const hashedPassword = await consultas.getPassword(nickname);

  if (hashedPassword <= 0)
    return res.json({
      message: "Nickname o Password erróneos.",
      success: false,
    });

  console.log(
    `Nickname : ${nickname}, Password : ${password}, hashed : ${hashedPassword[0].passwrd}`
  );

  const isPassword = await utilities.verifyPassword(
    password,
    hashedPassword[0].passwrd
  );

  if (isPassword.success) {
    const data = { id: hashedPassword[0].id, nickname };
    const token = auth.createToken(data);

    if (!token.success)
      res.json({
        message: "Error al crear el token.",
        sucess: false,
      });

    return res.json({
      message: "Contraseña correcta.",
      success: true,
      token: token.token,
      id: data.id,
    });
  } else return res.json({ message: "Contraseña incorrecta.", success: false });
}

async function loginJWT(req, res) {
  const { JWT } = req.body;

  if (!JWT)
    return res.json({
      message: "No se ha proporcionado el token.",
      success: false,
    });

  const isValid = utilities.verifyJWT(JWT);

  if (isValid.success)
    return res.json({ message: "Token correcto.", sucess: true });
  else return res.json({ message: "Token incorrecto.", sucess: false });
}

async function postFollow(req, res) {
  try {
    if (!req.user.id)
      return res.json({ message: "Error en la obtención del token." });
    const id = req.user.id;
    const { nickname } = req.body;
    console.log(`id : ${id} nickname: ${nickname}`);
    if (!id)
      return res.json({
        message: "No se ha otorgado ningún usuario.",
        success: false,
      });

    if (!nickname)
      return res.json({
        message: "No se ha proporcionado un usuario al que seguir.",
        success: false,
      });

    const resultado = await consultas.postFollow(id, nickname);

    if (resultado)
      return res.json({
        message: "Se ha seguido al usuario con éxito.",
        success: true,
      });
  } catch (error) {
    logger.error(error);
    if (error.message)
      return res.json({ message: "Error al dar follow.", success: false });
  }
}

async function postUnfollow(req, res) {
  try {
    if (!req.user.id) {
      console.log("Error en la obtención del token");
      return res.json({ message: "Error en la obtención del token." });
    }
    const id = req.user.id;
    const { nickname } = req.body;
    console.log(`id : ${id} nickname: ${nickname}`);
    if (!id)
      return res.json({
        message: "No se ha otorgado ningún usuario.",
        success: false,
      });

    if (!nickname)
      return res.json({
        message: "No se ha proporcionado un usuario al que seguir.",
        success: false,
      });

    const resultado = await consultas.postUnfollow(id, nickname);

    if (resultado)
      return res.json({
        message: "Se ha seguido al usuario con éxito.",
        success: true,
      });
  } catch (error) {
    logger.error(error);
    return res.json({ message: "Error al dar unfollow.", success: false });
  }
}

async function putUser(req, res) {
  //Nota para después explicarlo
  //Si el token tiene el role de admin, entonces toma el id de la request
  //Si el token tiene el role de user, entonces toma el id del token
  //Ya que en el método authenticateToken, en el objeto "req",
  //creas un nuevo objeto llamado user donde guardas los datos del usuario

  const {
    id: targetId,
    username,
    nickname: targetNickname,
    password,
    newpassword,
  } = req.body;

  const profile_image = req.body.profileimageurl;

  const isAdmin = req.user.role === "admin";

  const id = isAdmin ? targetId : req.user.id;
  const nickname = isAdmin ? targetNickname : req.user.nickname;

  if (!username && !password && !profile_image) {
    return res.json({
      message: "Debe proporcionar al menos un campo para actualizar.",
      success: false,
    });
  }
  try {
    const campos = [];
    const valores = [];

    if (username) {
      const usernameValidation = utilities.validateName(username);
      if (usernameValidation) return res.json(usernameValidation);

      campos.push("username = ?");
      valores.push(username);
    }
    if (newpassword && password) {
      const savedPassword = await consultas.getPassword(nickname);

      const resultado = await utilities.verifyPassword(
        password,
        savedPassword[0].passwrd
      );

      if (resultado.success) {
        campos.push("passwrd = ?");
        valores.push(await utilities.createHash(newpassword));
        console.log("está bien mi loco");
      } else {
        console.log("asd"+resultado.message);
        return res.json(resultado);
      }
    }
    if (profile_image) {
      campos.push("profile_image = ?");
      valores.push(profile_image);
    }
    const idValidation = utilities.validateId(id);
    if (idValidation) return res.json(idValidation);
    valores.push(id);

    const resultado = await consultas.putUser(valores, campos);
    return res.json({message: "Se ha actualizado el usuario con éxito.", success: true});
  } catch (error) {
    logger.error(error);
    return res.json({
      message: "Error al actualizar a un usuario.",
      success: false,
    });
  }
}

async function deleteUser(req, res) {
  const id = req.user.id;
  console.log("h");

  try {
    if (!id) return res.json(respuestas.error(req, res, "Bad request", 400));
    else {
      const resultado = await consultas.deleteUser(id);
      if (resultado) return res.json(resultado);
    }
  } catch (error) {
    logger.error(error);
    return res.json({
      message: "Error al eliminar un usuario",
      success: false,
    });
  }
}

//Funciones no utilizadas en Endpoints

async function getIdByNickname(nickname) {
  const validate = utilities.validateNickname(nickname);
  if (validate) return validate;

  try {
    const resultado = await consultas.getIdByNickname(nickname);
    return resultado;
  } catch (error) {
    console.log(error);
    return res.json({ message: "Error", success: false });
  }
}
module.exports = {
  getUser,
  getUserByNick,
  getUploadVideo,
  // getUserById,
  getUserByName,
  postUser,
  putUser,
  deleteUser,
  getIdByNickname,
  getFollowingUsers,
  getFollowers,
  postFollow,
  postUnfollow,
  loginUser,
  loginJWT,
};
