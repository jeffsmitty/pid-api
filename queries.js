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

const db = pgp(pool);
const getAllPIDs = (req, res, next) => {
  db.any('SELECT * FROM pid ORDER BY created DESC')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL PIDs',
          version: 'Using latest version of the USGS PID API'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

const createPID = (req, res, next) => {
  var now = moment().format();
  req.body.username = "jasmith@contractor.usgs.gov"
  req.body.created = now;
  req.body.modified = now; 
  req.body.uuid = uuidv4();
  db.none('insert into pid(title, purl, username, pid, created, modified) values (${title}, ${purl}, ${username}, ${uuid}, ${created}, ${modified})', 
req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Inserted a PID',
          version: 'Using latest version of the USGS PID API'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllPIDs,
  createPID
}