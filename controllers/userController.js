const httpStatus = require('http-status-codes');
const User = require('../models/user')

/** User Controller **\
 * /user
 *    /username -> availability
 *    /signup/:username/:password -> ?err
 */
function usernameAvailable(username, callback){
  User.findOne({ username }).exec(callback)
}
function newUser(user, callback){
  const newUser = new User(user)
  newUser.save(callback)
}
exports.username = (req, res) => {
  const username = req.params.username
  usernameAvailable(username, (err, u) => {
    if (err) {
      res.status(500)
      console.error(err)
    }
    else res.send(!u)
  })
}
exports.signup = (req, res) => {
  const username = req.params.username
  const password = req.params.password
  usernameAvailable(username, (err, u) => {
    if (err) res.send(err)
    else if (u) res.status(httpStatus.FORBIDDEN).send(new Error('usernmae already exists').toString())
    else newUser({ username, password }, err => res.send(err))
  })
}
