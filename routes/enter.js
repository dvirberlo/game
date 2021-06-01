const express = require('express')
const router = express.Router()

const enterController = require('../controllers/enterController')

/* GET enter page. */
router.get('/', function (req, res, next) {
  res.render('enter', { view: 'enter' })
})

/* GET enter listing. */
router.get('/username/:username', enterController.username)
router.get('/login/:username/:password/:remember', enterController.login)
router.get('/signup/:username/:password', enterController.signup)

module.exports = router
