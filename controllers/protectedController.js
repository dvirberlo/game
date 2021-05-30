// const User = require('../models/user')
const AuthToken = require('../models/authToken')
const createError = require('http-errors')
// const client = require('../lib/client')

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
exports.authCheck = (req, res, next) => {
  req.auth = false
  AuthToken.find({ user: req.cookies.UserId }, (err, docs) => {
    if (err) return next(createError(err))
    for (const doc of docs) req.auth = req.auth || req.cookies.AuthToken === doc.token
    next()
  })
}
