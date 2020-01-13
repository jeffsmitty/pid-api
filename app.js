'use strict'

// Set the run environment for the app here
process.env.NODE_ENV = 'local'
// process.env.NODE_ENV = 'development'
// process.env.NODE_ENV = 'staging'
// process.env.NODE_ENV = 'production'

// config variables for the declared environment
require('./config/config.js')

var express = require('express')
var createError = require('http-errors')
var path = require('path')
var cookieParser = require('cookie-parser')
var indexRouter = require('./routes/index')
// var usersRouter = require('./routes/users')
var purlRouter = require('./routes/purlRouter')
var apiRouter = require('./routes/apiRouter')
const expressWinston = require('express-winston')
const logger = require('./logger.js')

var app = express()

logger.info('**** ' + `${global.gConfig.app_name}` + ' started - run environment: ' + `${global.gConfig.config_id}` + ' ****')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Place the express-winston logger before the router.
app.use(expressWinston.logger({
  transports: logger.transports,
  exitOnError: false
}))

// Main app routes
app.use('/', indexRouter)
app.use('/api', apiRouter)
app.use('/purl', purlRouter)
// app.use('/users', usersRouter)

// Place the express-winston errorLogger after the router.
app.use(expressWinston.errorLogger({
  transports: logger.transports
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

module.exports = app
