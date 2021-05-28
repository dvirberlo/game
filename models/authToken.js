const mongoose = require('mongoose')

const AuthTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: String,
  createdAt: { type: Date, expires: 3600, default: Date.now }
})

AuthTokenSchema.index({ expireAt: 1 }, { expiresAfterSeconds: 120 })

module.exports = mongoose.model('AuthToken', AuthTokenSchema)
