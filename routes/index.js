const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { view: 'index' })
})
/* GET game page. */
router.get('/game', function (req, res, next) {
  res.render('game', { view: 'game' })
})

module.exports = router
