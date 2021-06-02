const express = require('express')
const router = express.Router()

const enterController = require('../controllers/enterController')

/* GET login page. */
router.get('/', function (req, res, next) {
  res.redirect('/enter/login')
})
router.get('/login', function (req, res, next) {
  res.render('login', { view: 'enter' })
})
/* GET signup page. */
router.get('/signup', function (req, res, next) {
  res.render('signup', { view: 'enter' })
})

/* GET enter listing. */
router.get('/username/', enterController.username)
router.get('/form/login', enterController.login)
router.get('/form/signup', enterController.signup)

module.exports = router
