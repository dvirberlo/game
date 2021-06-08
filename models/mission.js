const mongoose = require('mongoose')

const MissionSchema = new mongoose.Schema({
  level: Number,
  description: String,
  map: Number
})

module.exports = mongoose.model('Mission', MissionSchema)
