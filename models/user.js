const mongoose = require('mongoose')

const ProgressSchema = new mongoose.Schema({
  currentCell: { type: Number, default: 0 },
  emptyCells: [{
    type: Number
  }]
})

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
  mission: {
    main: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
    progress: { type: ProgressSchema }
  }
})

module.exports = mongoose.model('User', UserSchema)
