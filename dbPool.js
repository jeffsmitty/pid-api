/* eslint-disable camelcase */
const promise = require('bluebird')
const logger = require('./logger')

// Initialization Options
const options = {
  promiseLib: promise
}
const pgp = require('pg-promise')(options)

// pgmonitor is part of pg-promise and is used to log db transactions
// Take only the SQL output of pgmonitor and send to our winston logger.
// Change the logger.debug below to logger.info to also send db query and error
// output to the combined log file
const monitor = require('pg-monitor')
monitor.attach(options, ['query', 'error'])
monitor.setLog((msg, info) => {
  info.display = false // suppress pgmonitor screen output for the event since our winston logger handles that
  logger.debug(info.text)
})

const pool = {
  database: global.gConfig.database,
  host: global.gConfig.db_host,
  port: global.gConfig.db_port,
  user: global.gConfig.db_user,
  password: global.gConfig.db_password
}

module.exports = { pool, pgp }
