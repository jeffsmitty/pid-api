const uuidv4 = require('uuid/v4')
const moment = require('moment')
const promise = require('bluebird')

const options = {
  // Initialization Options
  promiseLib: promise
}

const pgp = require('pg-promise')(options)

// Configuration Object
const pool = {
  user: 'app_pid',
  host: 'localhost',
  database: 'pid',
  password: 'password',
  port: 5432
}

const db = pgp(pool)
const v1getAllPIDs = (req, res, next) => {
  console.info('Creating PID')
  db.any('SELECT * FROM pid ORDER BY created DESC')
    .then(function (data) {
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
      return next(err)
    })
}

const v1createPID = (req, res, next) => {
  var now = moment().format()
  req.body.username = 'jasmith@contractor.usgs.gov'
  req.body.created = now
  req.body.modified = now
  req.body.uuid = uuidv4()
  req.body.apiversion = 'v1'
  db.none('insert into pid(title, purl, apiversion, username, pid, created, modified) values (${title}, ${purl}, ${apiversion}, ${username}, ${uuid}, ${created}, ${modified})',
    req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Created PID',
          apiVersion: 'v1',
          apiMessage: 'Using latest version of the USGS PID API'
        })
    })
    .catch(function (err) {
      return next(err)
    })
}

function v1deletePID (req, res, next) {
  // var uuid = parseInt(req.params.pid)
  const uuid = req.params.pid
  console.log('uuid param is ' + uuid)
  db.result('delete from pid where pid = $1', uuid)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          apiVersion: 'v1',
          apiMessage: 'Using latest version of the USGS PID API'
        })
    })
    .catch(function (err) {
      return next(err)
    })
}

module.exports = {
  v1getAllPIDs,
  v1createPID,
  v1deletePID
}
