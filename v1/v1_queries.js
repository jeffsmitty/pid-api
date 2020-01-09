/* eslint-disable camelcase */
const uuidv4 = require('uuid/v4')
const moment = require('moment')
const promise = require('bluebird')

// Initialization Options
const options = {
  promiseLib: promise
}
const pgp = require('pg-promise')(options)

// pgmonitor sends db output for all postgres events to the console
const monitor = require('pg-monitor')
monitor.attach(options) // attach to all events at once;
monitor.setLog((msg, info) => {
  console.log(msg)
})

// Configuration Object
const pool = {
  user: 'app_pid',
  host: 'localhost',
  database: 'pid',
  password: 'password',
  port: 5432
}

// const pool = {
//   database: global.gConfig.database,
//   host: global.gConfig.db_host,
//   port: global.gConfig.db_port,
//   user: global.gConfig.db_user,
//   password: global.gConfig.db_password
// }

const db = pgp(pool)

const v1_getSinglePID = (req, res, next) => {
  var uuid = req.params.pid
  db.one('SELECT * FROM pid where pid = $1', uuid)
    .then(data => {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved PID',
          apiVersion: 'v1',
          apiMessage: 'Using latest version of the USGS PID API'
        })
    })
    .catch(function (err) {
      return500(res)
      return next(err)
    })
}

const v1_getAllPIDs = (req, res, next) => {
  db.any('SELECT * FROM pid ORDER BY created DESC')
    .then(data => {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL PIDs',
          apiVersion: 'v1',
          apiMessage: 'Using latest version of the USGS PID API'
        })
    })
    .catch(function (err) {
      return500(res)
      return next(err)
    })
}

const v1_createPID = (req, res, next) => {
  var now = moment().format()
  req.body.createdby = 'jasmith@contractor.usgs.gov'
  req.body.created = now
  req.body.modified = now
  req.body.pid = uuidv4()
  req.body.apiversion = 'v1'
  db.one('insert into pid(created, pid, title, createdby, modified, apiversion, url, pidtype) values ($(created), $(pid), $(title), $(createdby), $(modified), $(apiversion), $(url), $(pidtype)) RETURNING title, pid',
    req.body)
    .then(data => {
      res.status(200)
        .json({
          status: 'success',
          message: 'Created PID: ' + data.pid + ' for item \'' + data.title + '\'',
          apiVersion: 'v1',
          apiMessage: 'Using latest version of the USGS PID API'
        })
    })
    .catch(function (err) {
      return500(res)
      return next(err)
    })
}

const v1_deletePID = (req, res, next) => {
  const uuid = req.body.pid
  // TODO - put all query text into a queryfile
  db.result('delete from pid where pid = $1', uuid)
    .then(result => {
      if (result.RowCount === 1) {
        res.status(200)
          .json({
            status: 'success',
            message: 'PID ' + uuid + ' deleted successfully',
            apiVersion: 'v1',
            apiMessage: 'Using latest version of the USGS PID API'
          })
      } else {
        res.status(400)
          .json({
            status: 'error',
            message: 'PID ' + uuid + ' not found',
            apiVersion: 'v1',
            apiMessage: 'Using latest version of the USGS PID API'
          })
      }
    })
    .catch(function (err) {
      return500(res)
      return next(err)
    })
}

const v1_updatePID = (req, res, next) => {
  console.log('update')
}

const return500 = (res) => {
  res.status(500)
    .json({
      status: 'error',
      message: 'Error 500:  Internal Server Error',
      apiVersion: 'v1',
      apiMessage: 'Using latest version of the USGS PID API'
    })
}

module.exports = {
  v1_getAllPIDs,
  v1_createPID,
  v1_deletePID,
  v1_updatePID,
  v1_getSinglePID
}
