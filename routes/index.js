var express = require('express')
var router = express.Router()
var db = require('../queries')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/api/pids', db.getAllPIDs)
router.post('/api/pid', db.createPID)
router.delete('/api/pid/:id', db.deletePID)
// TODO:  Add sanitization
module.exports = router
