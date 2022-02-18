const createError = require('http-errors')

const User = require('../models/user')
const AuthToken = require('../models/authToken')

exports.authCheck = (req, res, next) => {
  req.UserId = req.cookies.UserId
  req.auth = false
  AuthToken.find({ user: req.UserId }, (error, auths) => {
    if (error) return next(createError(500))
    for (const auth of auths) req.auth = req.auth || req.cookies.AuthToken === auth.token
    if (!req.auth) return next(createError.Unauthorized())
    next()
  })
}
exports.getData = (req, res, next) => {
  User.findById(req.UserId, { _id: 0, __v: 0, password: 0 }, (error, user) => {
    if (error) return next(createError(500))
    res.json(user)
  })
}
