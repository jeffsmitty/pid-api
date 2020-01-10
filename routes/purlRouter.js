var express = require('express')
var router = express.Router()

/* GET url and route to it. */
router.get('/', function (req, res, next) {
  // get the parameter from the request, look up the PID in the DB, fetch the
  // url to route to, and then redirect to that url
  res.redirect('https://www.google.com')
})

module.exports = router
