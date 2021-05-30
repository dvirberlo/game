const mongoose = require('mongoose')

const rememberExpiration = 1000 * 60 * 60 * 24 * 30 * 12

const AuthTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: String,
  remember: { type: Boolean, default: true },
  createdAt: { type: Date, expires: '12h', default: Date.now }
})
AuthTokenSchema.post('save', doc => {
  if (!doc.remember) return false
  doc.createdAt = new Date(Date.now() + rememberExpiration)
  doc.remember = false
  doc.save()
})

module.exports = mongoose.model('AuthToken', AuthTokenSchema)
module.exports.rememberExpiration = rememberExpiration
