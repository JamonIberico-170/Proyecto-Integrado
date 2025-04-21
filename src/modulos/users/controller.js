const consultas = require("./sql");
const respuestas = require("../../red/respuestas");
const utilities = require("../../utils/utils");
const auth = require("../../auth/auth");

async function get(req, res) {
  try {
    return res.json(await consultas.get());
  } catch (error) {
    console.log(error);
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
  const { nickname } = req.params;
  const validate = utilities.validateNickname(nickname);
  if (validate) return res.json(validate);
  try {
    const resultado = await consultas.getUserByNick(nickname);
    if (resultado.length > 0) return res.json(resultado);
    else {
      return res.json({
        message: "User not found",
        data: {
          nickname,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}
async function getUserByName(req, res) {
  const { username, offset } = req.body;
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
    console.log(error);
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
      email,
      hashedPassword,
      profile_image
    );

    if (resultado) {
      
      const token = auth.createToken(resultado.data);

      return res.json(token);
    }else{
      return res.json({message: "No se pudo registrar el usuario.", success: false})
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: "Error", success: false });
  }
}

async function putUser(req, res) {
  //Nota para después explicarlo
  //Si el token tiene el role de admin, entonces toma el id de la request
  //Si el token tiene el role de user, entonces toma el id del token
  //Ya que en el método authenticateToken, en el objeto "req",
  //creas un nuevo objeto llamado user donde guardas los datos del usuario
  console.log(req.body);
  const {
    id: targetId,
    username,
    nickname: targetNickname,
    password,
    newpassword,
    profile_image,
  } = req.body;

  const isAdmin = req.user.role === "admin";

  const id = isAdmin ? targetId : req.user.id;
  console.log(`Este es el id ${id}`);
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
      } else return res.json(resultado);
    }
    if (profile_image) {
      campos.push("profile_image = ?");
      valores.push(profile_image);
    }
    const idValidation = utilities.validateId(id);
    if (idValidation) return res.json(idValidation);
    valores.push(id);

    const resultado = await consultas.putUser(valores, campos);

    return res.json(resultado);
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Error al actualizar un usuario.",
      success: false,
    });
  }
}

async function deleteUser(req, res) {
  const id = req.user.id;

  try {
    if (!id) return res.json(respuestas.error(req, res, "Bad request", 400));
    else {
      const resultado = await consultas.deleteUser(id);
      if (resultado) return res.json(resultado);
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  get,
  getUserByNick,
  // getUserById,
  getUserByName,
  postUser,
  putUser,
  deleteUser,
};
