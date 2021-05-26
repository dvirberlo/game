const User = require('../models/user')
const { StatusCodes } = require('http-status-codes')
const cookieParser = require('cookie-parser')
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
  return crypto.randomBytes(bytes).toString('hex');
}
function registerAuthToken (user, req, res) {
  const token = generateAuthToken()
  const expiresDefault = 1000 * 60 * 60 * 6
  const remember = req.params.remember === 'true' ? 1000 * 60 * 60 * 24 * 30 * 12 : 0 
  const expires = remember ? new Date(Date.now() + remember) : false
  const expiresTime = remember || expiresDefault
  user.authTokens.push({ token })
  user.save(err => {
    if (err) client.error(res, err, StatusCodes.INTERNAL_SERVER_ERROR, true)
    else {
      res.cookie('AuthToken', token, { expires })
      client.send(res)
    }
  })
}
exports.login = (req, res) => {
  const username = req.params.username
  const password = req.params.password
  userpassCheck(username, password, (err, user) => {
    if (err || !user) client.multiError(res, err, StatusCodes.INTERNAL_SERVER_ERROR, new Error('wrong username or password'), StatusCodes.FORBIDDEN)
    else registerAuthToken(user, req, res)
  })
}
