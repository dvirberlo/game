const createError = require('http-errors')
const User = require('../models/user')
const client = require('../lib/client')

/** User Controller **\
 * /user
 *    /username -> availability
 *    /signup/:username/:password -> ?err
 */
function usernameAvailable (username, callback) {
  User.findOne({ username }, callback)
}
function newUser (user, callback) {
  const newUser = new User(user)
  newUser.save(callback)
}
exports.username = (req, res, next) => {
  const username = req.params.username
  usernameAvailable(username, (err, user) => {
    if (err) return next(createError(err))
    client.send(res, !user)
  })
}
exports.signup = (req, res, next) => {
  const username = req.params.username
  const password = req.params.password
  newUser({ username, password }, err => {
    if (err) return next(createError(err))
    client.send(res)
  })
}
