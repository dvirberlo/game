const User = require('../models/user')
const AuthToken = require('../models/authToken')
const createError = require('http-errors')
const crypto = require('crypto')
const client = require('../lib/client')
/** Protected Controller
 * /protected
 *   /login/:username/:password/:remeber -> id
 *   /:username
 *     / -> data
 *     /move/:des -> ?err
 *     /quit -> ?err
 *     /enter/:id -> ?err
 *     /battle/:id -> ?err
 *     /mission -> available mission
 */
const generateAuthToken = (bytes = 30) => {
  return crypto.randomBytes(bytes).toString('hex')
}
function registerAuthToken (user, req, res, next) {
  const token = generateAuthToken()
  const remember = req.params.remember === 'true'
  const expires = remember ? new Date(Date.now() + AuthToken.rememberExpiration) : false
  const Auth = new AuthToken({ user: user._id, token, remember })
  Auth.save(err => {
    if (err) return next(createError(err))
    res.cookie('AuthToken', token, { expires })
    client.send(res)
  })
}
exports.login = (req, res, next) => {
  const username = req.params.username
  const password = req.params.password
  User.findOne({ username, password }, (err, user) => {
    if (err) return next(createError(err))
    if (!user) return next(createError.Forbidden('Wrong username or password'))
    registerAuthToken(user, req, res, next)
  })
}
exports.authCheck = (req, res, next) => {
  req.auth = false
  AuthToken.find({ user: req.params.username }, (err, docs) => {
    if (err) return next(createError(err))
    for (const doc of docs) req.auth = req.auth || req.cookies.AuthToken === doc.token
    next()
  })
}
