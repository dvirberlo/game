const express = require('express')
const router = express.Router()

const enterController = require('../controllers/enterController')

/** Enter Router
 * /enter
 *   /signup
 *   /login
 *   /form
 *     /username -> availability -> Boolean
 *     /signup(username, password) -> ../login
 *     /login(username, password) -> /game
 */
/* GET login page. */
router.get('/', function (req, res, next) {
  res.redirect('/enter/login')
})

router.get('/login', function (req, res, next) {
  res.render('login', { view: 'enter', error: req.query.error })
})
/* GET signup page. */
router.get('/signup', function (req, res, next) {
  res.render('signup', { view: 'enter', error: req.query.error })
})

/* GET enter listing. */
router.get('/username/', enterController.username)
router.get('/form/signup', enterController.signup)
router.get('/form/login', enterController.login)

module.exports = router
