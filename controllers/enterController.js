const crypto = require('crypto')
const createError = require('http-errors')
const User = require('../models/user')
const AuthToken = require('../models/authToken')

/** User Controller **\
 * /user
 *    /username -> availability
 *    /signup/:username/:password -> ?err
 *    /login/:username/:password/:remember -> id
 */
const generateAuthToken = (bytes = 20) => {
  return crypto.randomBytes(bytes).toString('hex')
}
function registerAuthToken (user, req, res, next) {
  const token = generateAuthToken()
  const remember = req.query.remember !== 'false'
  const expires = remember ? new Date(Date.now() + AuthToken.rememberExpiration) : false
  const Auth = new AuthToken({ user: user._id, token, remember })
  Auth.save(err => {
    if (err) return next(createError(err))
    res.cookie('AuthToken', token, { expires })
    res.cookie('UserId', user._id, { expires })
    res.redirect('/game')
  })
}
exports.username = (req, res, next) => {
  const username = req.query.username
  User.findOne({ username }, (err, user) => {
    if (err) return next(createError(err))
    res.json(!user)
  })
}
exports.signup = (req, res, next) => {
  const username = req.query.username
  const password = req.query.password
  new User({ username, password }).save(err => {
    if (err) return next(createError(err))
    res.redirect('../login')
  })
}
exports.login = (req, res, next) => {
  const username = req.query.username
  const password = req.query.password
  User.findOne({ username, password }, (err, user) => {
    if (err) return next(createError(err))
    if (!user) return res.redirect('/enter/login?error=Wrong username or password')
    registerAuthToken(user, req, res, next)
  })
}
