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

function userpassCheck (username, password, callback) {
  User.findOne({ username, password }).exec(callback)
}
const generateAuthToken = (bytes = 30) => {
  return crypto.randomBytes(bytes).toString('hex')
}
function registerAuthToken (user, req, res, next) {
  const token = generateAuthToken()
  // const expiresDefault = 1000 * 60 * 60 * 6
  const remember = req.params.remember === 'true' ? 1000 * 60 * 60 * 24 * 30 * 12 : 0
  const expires = remember ? new Date(Date.now() + remember) : false
  // const expiresTime = remember || expiresDefault
  const Auth = new AuthToken({ user: user._id, token })
  Auth.save(err => {
    if (err) return next(createError(err))
    res.cookie('AuthToken', token, { expires })
    client.send(res)
  })
}
exports.login = (req, res, next) => {
  const username = req.params.username
  const password = req.params.password
  userpassCheck(username, password, (err, user) => {
    if (err) return next(createError(err))
    if (!user) return next(createError.Forbidden('Wrong username or password'))
    registerAuthToken(user, req, res, next)
  })
}
exports.authCheck = (req, res, next) => {
  // TODO req.cookies['AuthToken'] exists in Auth?
  req.auth = true
  next()
}
