const mongoose = require('mongoose')

const longExpiration = 1000 * 60 * 60 * 24 * 30 * 12

const AuthTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: String,
  remember: { type: Boolean, default: true },
  createdAt: { type: Date, expires: '12h', default: Date.now }
})

AuthTokenSchema.post('save', auth => {
  if (!auth.remember) return false
  auth.createdAt = new Date(Date.now() + longExpiration)
  auth.remember = false
  auth.save()
})

module.exports = mongoose.model('AuthToken', AuthTokenSchema)
module.exports.longExpiration = longExpiration
