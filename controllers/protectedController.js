const User = require('../models/user')
const { StatusCodes } = require('http-status-codes')
// const cookieParser = require('cookie-parser')

/** Protected Controller
 * /protected
 *   /login/:username/:password -> id
 *   /:userId
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
function registerSHA (username, password, u) {
}
exports.login = (req, res) => {
  const username = req.params.username
  const password = req.params.password
  userpassCheck(username, password, (err, u) => {
    if (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      console.error(err)
    } else if (!u) res.send(new Error('wrong username or password').toString())
    else registerSHA(username, password, u)
  })
}
