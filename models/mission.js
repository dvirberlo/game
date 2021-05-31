const mongoose = require('mongoose')

const ProgressSchema = new mongoose.Schema({
  currentCell: { type: Number, default: 0 },
  emptyCells: [{
    type: Number
  }]
})

const MissionSchema = new mongoose.Schema({
  level: Number,
  description: String,
  map: { type: mongoose.Schema.Types.ObjectId, ref: 'Map' },
  progress: { type: ProgressSchema }
})

module.exports = mongoose.model('Mission', MissionSchema)
