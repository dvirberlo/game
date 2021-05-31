const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  xp: { type: Number, default: 0 },
  resources: {
    lights: { type: Number, default: 10 },
    gems: { type: Number, default: 5 },
    flowers: { type: Number, default: 5 }
  },
  spells: { type: Array, default: [0] },
  mission: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' }
})

module.exports = mongoose.model('User', UserSchema)
