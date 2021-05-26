const { StatusCodes } = require('http-status-codes')
const User = require('../models/user')
const client = require('../lib/client')

/** User Controller **\
 * /user
 *    /username -> availability
 *    /signup/:username/:password -> ?err
 */
function usernameAvailable (username, callback) {
  User.findOne({ username }).exec(callback)
}
function newUser (user, callback) {
  const newUser = new User(user)
  newUser.save(callback)
}
exports.username = (req, res) => {
  const username = req.params.username
  usernameAvailable(username, (err, u) => {
    if (err) client.error(res, err, StatusCodes.INTERNAL_SERVER_ERROR, true)
    else res.send(!u)
  })
}
exports.signup = (req, res) => {
  const username = req.params.username
  const password = req.params.password
  usernameAvailable(username, (err, u) => {
    if (err) client.error(res, err, StatusCodes.INTERNAL_SERVER_ERROR)
    else if (u) client.error(res, new Error('usernmae already exists'), StatusCodes.FORBIDDEN)
    else newUser({ username, password }, err => client.error(res, err, StatusCodes.INTERNAL_SERVER_ERROR))
  })
}
