var express = require('express')
var router = express.Router()
var v1 = require('../v1/v1_queries')
const { check, validationResult } = require('express-validator')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/api/v1/pids', v1.v1_getAllPIDs)
// router.post('api/v1/pids', db.v1createPID)

router.post('/api/v1/pid', [
  check('title')
    .not().isEmpty()
    .trim()
    .escape()
    .withMessage('Title must not be empty'),
  check('url')
    .not().isEmpty()
    .isURL()
    .withMessage('URL must be a valid URL')
], (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  } else {
    v1.v1_createPID(req, res, next)
  }
})

router.delete('/api/v1/pid', [
  check('pid')
    .not().isEmpty()
    .withMessage('Please specify a PID to delete in the request body')
], (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  } else {
    v1.v1_deletePID(req, res, next)
  }
})

module.exports = router
