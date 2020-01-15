const express = require('express')
const router = express.Router()
const v1 = require('../v1/v1_queries')
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
    .exists()
    .withMessage('Request is missing a required parameter: title')
    .bail()
    .not().isEmpty()
    .withMessage('Request must include a title')
    .bail()
    .isLength({ min: 5 })
    .withMessage('Title must be at least 5 chars long')
    .trim()
    .escape(),
  check('pidtype')
    .exists()
    .withMessage('Request is missing a required parameter: pidtype')
    .bail()
    .not().isEmpty()
    .withMessage('Request must include a pidtype'),
  check('url')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('URL must be a valid URL')
], (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  } else {
    v1.v1_createPID(req, res, next)
  }
})

router.put('/v1/pid', [
  check('pid')
    .not().isEmpty()
    .trim()
    .escape()
    .withMessage('Request must include PID param to update.')
], (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  } else {
    v1.v1_updatePID(req, res, next)
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
    return res.status(422).json({ errors: errors.array() })
  } else {
    v1.v1_deletePID(req, res, next)
  }
})

module.exports = router
