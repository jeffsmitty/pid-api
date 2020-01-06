/* eslint-disable camelcase */
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
const v1_getAllPIDs = (req, res, next) => {
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

const v1_createPID = (req, res, next) => {
  var now = moment().format()
  req.body.username = 'jasmith@contractor.usgs.gov'
  req.body.created = now
  req.body.modified = now
  req.body.pid = uuidv4()
  req.body.apiversion = 'v1'
  req.body.purl = 'https://www.usgs.gov/purls/' + req.body.pid
  db.none('insert into pid(title, url, purl, apiversion, username, pid, created, modified) values ($(title), $(url), $(purl), $(apiversion), $(username), $(pid), $(created), $(modified))',
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

function v1_deletePID (req, res, next) {
  const uuid = req.body.pid
  console.log('uuid param is ' + uuid)
  db.result('delete from pid where pid = $1', uuid)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Deleted PID',
          apiVersion: 'v1',
          apiMessage: 'Using latest version of the USGS PID API'
        })
    })
    .catch(function (err) {
      return next(err)
    })
}

module.exports = {
  v1_getAllPIDs,
  v1_createPID,
  v1_deletePID
}
