const crypto = require('crypto')
const createError = require('http-errors')

const User = require('../models/user')
const AuthToken = require('../models/authToken')

function generateAuthToken (bytes = 20) {
  return crypto.randomBytes(bytes).toString('hex')
}
function newAuthToken (user, req, res, next) {
  const token = generateAuthToken()
  const remember = req.query.remember !== 'false'
  const expires = remember ? new Date(Date.now() + AuthToken.longExpiration) : false
  new AuthToken({ user: user._id, token, remember }).save(error => {
    if (error) return next(createError(error))
    res.cookie('AuthToken', token, { expires })
    res.cookie('UserId', user._id, { expires })
    res.redirect('/game')
  })
}
exports.username = (req, res, next) => {
  const username = req.query.username
  User.findOne({ username }, (error, user) => {
    if (error) return next(createError(error))
    res.json(!user)
  })
}
exports.signup = (req, res, next) => {
  const username = req.query.username
  const password = req.query.password
  new User({ username, password }).save(error => {
    if (error) return next(createError(error))
    res.redirect('../login')
  })
}
exports.login = (req, res, next) => {
  const username = req.query.username
  const password = req.query.password
  User.findOne({ username, password }, (error, user) => {
    if (error) return next(createError(error))
    if (!user) return res.redirect('/enter/login?error=Wrong username or password')
    newAuthToken(user, req, res, next)
  })
}
