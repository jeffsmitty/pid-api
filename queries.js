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
const getAllPIDs = (req, res, next) => {
  db.any('SELECT * FROM pid ORDER BY created DESC')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL PIDs',
          apiversion: 'Using latest version of the USGS PID API'
        })
    })
    .catch(function (err) {
      return next(err)
    })
}

const createPID = (req, res, next) => {
  var now = moment().format()
  req.body.username = 'jasmith@contractor.usgs.gov'
  req.body.created = now
  req.body.modified = now
  req.body.uuid = uuidv4()
  db.none('insert into pid(title, purl, username, pid, created, modified) values (${title}, ${purl}, ${username}, ${uuid}, ${created}, ${modified})',
    req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Inserted a PID',
          apiversion: '1.0',
          apimessage: 'This version of the PID API is depreceated. Please use the latest version.  More info: '
        })
    })
    .catch(function (err) {
      return next(err)
    })
}

function deletePID (req, res, next) {
  var uuid = parseInt(req.params.pid)
  db.result('delete from pid where pid = $1', uuid)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} PID`
        })
    })
    .catch(function (err) {
      return next(err)
    })
}

module.exports = {
  getAllPIDs,
  createPID,
  deletePID
}
