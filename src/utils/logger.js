const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) =>
      `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    //Esto te crea una carpeta, en este caso en la carpeta raíz del proyecto, donde se van a ir guardando los Logs.
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

module.exports = logger;