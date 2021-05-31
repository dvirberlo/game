const mongoose = require('mongoose')

const MapObjetSchema = new mongoose.Schema({
  level: Number,
  cell: Number,
  kind: String,
  details: { type: Object, default: null }
})

const MapSchema = new mongoose.Schema({
  startCell: { type: Number, default: 0 },
  cells: [{ type: Number }],
  backgroud: String,
  objects: [{
    type: MapObjetSchema
  }]
})

module.exports = mongoose.model('Map', MapSchema)
