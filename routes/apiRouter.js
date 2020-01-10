var express = require('express')
var router = express.Router()
var v1 = require('../v1/v1_queries')
const { check, validationResult } = require('express-validator')

router.get('/', function (req, res, next) {
  // send to swagger docs when user hits /api
  // res.redirect('url');)
  res.send('swagger docs go here')
})

router.get('/v1/pids', v1.v1_getAllPIDs)

router.get('/v1/pid/:pid', v1.v1_getSinglePID)

router.post('/v1/pid', [
  check('title')
    .not().isEmpty()
    .trim()
    .escape()
    .withMessage('Title must not be empty')
], (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  } else {
    v1.v1_createPID(req, res, next)
  }
})

router.delete('/v1/pid', [
  check('pid')
    .not().isEmpty()
    .withMessage('Please specify a PID to delete in the request body'),
  check('pid')
    .isUUID()
    .withMessage('PID is not in valid UUID format')
], (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  } else {
    v1.v1_deletePID(req, res, next)
  }
})

module.exports = router
