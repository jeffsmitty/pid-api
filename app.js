// Set the run environment
process.env.NODE_ENV = 'development'
// process.env.NODE_ENV = 'staging'
// process.env.NODE_ENV = 'production'

// config variables for the declared environment
const config = require('./config/config.js')

var express = require('express')
var expressWinston = require('express-winston')
var winston = require('winston')
var createError = require('http-errors')
var path = require('path')
var cookieParser = require('cookie-parser')
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Define some transports for use by winston and express-winston
var pidTransports = [
  new winston.transports.File({
    level: 'info',
    filename: './logs/pidlog.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true
  }),
  new winston.transports.Console({
    handleExceptions: true,
    json: true,
    colorize: true
  })
]

// Place the express-winston logger before the router.
app.use(expressWinston.logger({
  transports: pidTransports,
  exitOnError: false
}))

app.use('/', indexRouter)
app.use('/users', usersRouter)

// Place the express-winston errorLogger after the router.
app.use(expressWinston.errorLogger({
  transports: pidTransports
}))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

console.log(`${global.gConfig.app_name}` + ' Running under ' + `${global.gConfig.config_id}`)

module.exports = app
