var express = require('express')
var router = express.Router()
var db = require('../queries')
const { check, validationResult } = require('express-validator')
const uuidv4 = require('uuid/v4')
const moment = require('moment')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/api/v1/pids', db.v1getAllPIDs)
// router.post('api/v1/pids', db.v1createPID)

router.post('/api/v1/pid', [
  check('title')
    .not().isEmpty()
    .trim()
    .escape()
    .withMessage('Title must not be empty'),
  check('purl')
    .not().isEmpty()
    .isURL()
    .withMessage('PURL must be a valid URL'),
], (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  } else {
    db.v1createPID(req, res, next)
  }
})

router.delete('/api/v1/pid', db.v1deletePID)

module.exports = router
