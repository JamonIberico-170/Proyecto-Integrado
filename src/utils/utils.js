const bcrypt = require("bcrypt");
const dbconnect = require("../DB/dbconnect");
const conexion = dbconnect.conexion;
const dns = require("dns");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { success } = require("../red/respuestas");

async function userExist(searchName, searchEmail) {
  if (!searchName) {
    return { message: "El usuario está vacío.", success: false };
  }
  if (!searchEmail) {
    return { message: "El email está vacío.", success: false };
  }

  const query =
    "SELECT nickname, email FROM user where nickname = ? or email = ?";

  return new Promise((resolve, reject) => {
    conexion.execute(query, [searchName, searchEmail], (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        if (result && result.length > 0) {
          const row = result[0];

          if (row.email === searchEmail) {
            return resolve({
              message: "El correo ya está en uso.",
              success: false,
            });
          }
          if (row.nickname === searchName) {
            return resolve({
              message: "El usuario ya existe.",
              success: false,
            });
          }
        }
        return resolve({
          message: "No se encontraron resultados.",
          success: true,
        });
      }
    });
  });
}

async function createHash(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function verifyPassword(password, hashedPassword) {
  console.log(`password : ${password}   hashed : ${hashedPassword}`);
  const comparation = await bcrypt.compare(password, hashedPassword);
  
  if (comparation)
    return { message: "La contraseña es correcta.", success: true };
  else return { message: "La contraseña es incorrecta.", success: false };
}

async function verifyJWT(JWT) {
  try {
    jwt.verify(JWT, process.env.JWT_SECRET); //En caso de que sea inválido saltará un error
    
    return { message: "El token es válido.", success: true };
  } catch (error) {
    return { message: "El token es inválido.", success: false };
  }
}
function validateId(id) {
  const isUndefined = id === undefined || id === null;
  const isNotNumeric = !/^\d+$/.test(id);
  const isNonPositive = parseInt(id) <= 0;

  if (isUndefined || isNotNumeric || isNonPositive) {
    return {
      message: "El ID no cumple con el estándar preestablecido.",
      success: false,
      data: {
        id: id,
      },
      standard: {
        range: "1..inf",
        allowedCharacters: "0-9",
        description: "Solo números enteros positivos mayores a cero",
      },
    };
  }

  return null; // ID válido
}

function validateName(username) {
  const isInvalidCharacters = !/^[a-zA-Z0-9]+$/.test(username);
  const isTooLong = username.length > 20;

  if (isInvalidCharacters || isTooLong) {
    return {
      message: "El nombre de usuario no cumple con el estándar preestablecido.",
      success: false,
      data: { username },
      standard: {
        maxLength: 20,
        allowedCharacters: "a-z, A-Z, 0-9",
        description: "Solo caracteres alfanuméricos sin espacios ni símbolos.",
      },
    };
  }

  return null;
}

function validateNickname(username) {
  const isInvalidCharacters = !/^@[a-zA-Z0-9]+$/.test(username);
  const isTooLong = username.length > 19;
  if (isInvalidCharacters || isTooLong) {
    return {
      message: "El nickname no cumple con el estándar preestablecido.",
      success: false,
      data: { username },
      standard: {
        maxLength: 20,
        allowedCharacters: "a-z, 0-9",
        description: "Solo caracteres alfanuméricos sin espacios ni símbolos.",
      },
    };
  }

  return null;
}

function validateEmailSyntax(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidLength = email.length <= 254; // Máximo permitido
  return isValidLength && regex.test(email);
}

async function verifyEmail(email) {
  if (!validateEmailSyntax(email)) {
    return {
      message: "El correo no cumple con los estándares",
      success: false,
      data: { email },
      standard: {
        maxLength: 254,
        allowedPattern: "Formato nombre@dominio.extensión",
        description:
          "Debe tener un formato válido y no superar los 254 carácteres.",
      },
    };
  }

  const domain = email.split("@")[1];

  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        resolve({
          message:
            "El dominio del correo no está configurado para recibir emails.",
          success: false,
          data: { email, domain },
        });
      } else {
        resolve({
          message: "El correo es válido y el dominio acepta correos.",
          success: true,
          data: { email, domain, mxRecords: addresses },
        });
      }
    });
  });
}

async function uploadVideo(req, res) {
  const { nickname } = req.body;

  const uploadPath = path.join(__dirname, `uploads/${nickname}/`);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${nickname}/`);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext); //¿Cómo quedaría? : NombreDelVideo-FechaActual-NúmeroAleatorio.ExtensiónDelArchivo
    },
  });

  const upload = multer({ storage: storage });
  upload.single("video");
}

function generateURL(fullPath) {
  const normalizedPath = path.normalize(fullPath);

  const parts = normalizedPath.split(path.sep); //Te hace una lista con cada uno de los cachitos de la ruta

  const relativeParts = parts.slice(parts.indexOf("uploads")); //Nos quedamos desde uploads hacia adelante

  return relativeParts.join("/"); //Reconstruímos la ruta añadiendo / entre cada elemento de la lista
}

function randomURL() {
  const caracteres =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let resultado = "";
  for (let i = 0; i < 9; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    resultado += caracteres[indiceAleatorio];
  }
  return resultado;
}

module.exports = {
  userExist,
  createHash,
  verifyPassword,
  validateId,
  validateName,
  verifyEmail,
  uploadVideo,
  validateNickname,
  generateURL,
  randomURL,
  verifyJWT
};
