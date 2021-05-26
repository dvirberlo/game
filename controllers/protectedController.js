const User = require('../models/user')
const { StatusCodes } = require('http-status-codes')
const cookieParser = require('cookie-parser')
const crypto = require('crypto')
const client = require('../lib/client')
/** Protected Controller
 * /protected
 *   /login/:username/:password -> id
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
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 12)
  user.authTokens.push({ token, expires })
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
    if (err) client.error(res, err, StatusCodes.INTERNAL_SERVER_ERROR, true)
    else if (!user) client.error(res, new Error('wrong username or password'))
    else registerAuthToken(user, req, res)
  })
}
