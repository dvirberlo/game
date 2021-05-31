const mongoose = require('mongoose')

const MissionSchema = new mongoose.Schema({
  level: Number,
  description: String,
  map: { type: mongoose.Schema.Types.ObjectId, ref: 'Map' }
})

module.exports = mongoose.model('Mission', MissionSchema)
