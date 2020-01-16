const winston = require('winston')
const fs = require('fs')
const path = require('path')
const logDir = 'logs'

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

// Create the main logger which will log errors to a dedicated file and all events to another file.
// Winston allows you to define a level property on each transport which specifies the maximum level of messages that a transport should log
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json()
  ),
  transports: [
    // - Write all logs with level `error` and below to `pid_error.log`
    // - Write all logs with level `info` and below to `pid_combined.log`
    new winston.transports.File({
      format: winston.format.json(),
      filename: path.join(logDir, 'pid_combined.log')
    }),
    new winston.transports.File({
      format: winston.format.json(),
      filename: path.join(logDir, 'pid_errorlog.log'),
      level: 'error'
    })
  ]
})

// If we're not in production then log from debug level to the `console` with a simple format
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(
      winston.format.align(),
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(info => `${info.level}   ${info.timestamp}   ${info.message}`)
    )
  }))
}

// TODO: When exception handler is added, app crashes
// logger.exceptions.handle(
//   new winston.transports.File({
//     filename: path.join(logDir, 'pid_exceptions.log')
//   })
// )

logger.info('Logger started.')
logger.warn('Test log WARNING message')
logger.debug('Test log DEBUG message')
logger.error('Test log ERROR message')

module.exports = logger
