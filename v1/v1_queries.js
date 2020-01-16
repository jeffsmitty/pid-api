/* eslint-disable camelcase */
const { pool, pgp } = require('../dbPool')
const uuidv4 = require('uuid/v4')
const moment = require('moment')

const apiversion = 'v1'

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
      return500(res, err)
      // return next(err)
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
      return500(res, err)
      // return next(err)
    })
}

const v1_createPID = (req, res, next) => {
  const now = moment().format()
  const title = req.body.title
  const pidtype = req.body.pidtype

  const columns = [
    'pid',
    'created',
    'modified',
    'title',
    'createdby',
    'pidtype',
    'apiversion'
  ]

  const values = [
    uuidv4(),
    now, // created
    now, // modified
    title,
    'jasmith@contractor.usgs.gov',
    pidtype,
    apiversion
  ]

  // URL is optional.  If we have a URL param in the body, add it to the columns and values arrays.
  if (req.body.url) {
    columns.push('url')
    values.push(req.body.url)
  }
  // Add the :name filter if your array is a list of SQL names/identifiers, so the array is parsed correctly.
  // Add the :list filter if your array is a list of values
  db.one('INSERT INTO pid ($1:name) values ($2:list) RETURNING title, pid', [columns, values])
  // db.one('insert into pid(created, pid, title, createdby, modified, apiversion, url, pidtype) values ($(created), $(pid), $(title), $(createdby), $(modified), $(apiversion), $(url), $(pidtype)) RETURNING title, pid', req.body)
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
      // return next(err)
      return500(res, err)
    })
}

const v1_updatePID = (req, res, next) => {
  var now = moment().format()
  req.body.modified = now
  const uuid = req.body.pid
  db.none('update pid set title=$1, modified=$2, url=$3, pidtype=$4 where pid=$5',
    [
      req.body.title,
      req.body.modified,
      req.body.url,
      req.body.pidtype,
      req.body.pid
    ]
  )
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'PID ' + uuid + ' updated successfully',
          apiVersion: 'v1',
          apiMessage: 'Using latest version of the USGS PID API'
        })
    })
    .catch(function (err) {
      return500(res, err)
      // return next(err)
    })
}

const v1_deletePID = (req, res, next) => {
  const uuid = req.body.pid
  // TODO - put all query text into a queryfile
  db.result('delete from pid where pid = $1', uuid)
    .then(result => {
      if (result.rowCount === 1) {
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
      return500(res, err)
      // return next(err)
    })
}

const return500 = (res, err) => {
  res.json({
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
