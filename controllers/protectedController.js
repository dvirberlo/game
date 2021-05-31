const User = require('../models/user')
const AuthToken = require('../models/authToken')
const createError = require('http-errors')
const client = require('../lib/client')

/** Protected Controller
 * /protected (authCheck)
 *   / -> data
 */
exports.authCheck = (req, res, next) => {
  req.UserId = req.cookies.UserId
  req.auth = false
  AuthToken.find({ user: req.UserId }, (err, docs) => {
    if (err) return next(createError(err))
    for (const doc of docs) req.auth = req.auth || req.cookies.AuthToken === doc.token
    if (!req.auth) return next(createError.Unauthorized())
    next()
  })
}
exports.getData = (req, res, next) => {
  User.findById(req.UserId, { _id: 0, __v: 0, password: 0 }, (err, doc) => {
    if (err) return next(createError(err))
    client.send(res, doc)
  })
}
