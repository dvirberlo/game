'use strict'

const mongoose = require('mongoose')
require('dotenv').config()
const User = require('../../models/user')
const Mission = require('../../models/mission')
const Map = require('../../models/map')
const AuthTokens = require('../../models/authToken')

// mongoose connection setup
mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error: '))

// because program is ansyc:
console.log('NOTE: terminate the program when you see its done')

// createModel(M, d)
// printModel(AuthTokens)
Mission.find({}, { map: 1 }).populate('map').exec((err, docs) => {
  if (err) return false
  console.log('printModel')
  for (const doc of docs) console.log(doc)
})
// userTokens('60b39aaac7fa480660bf80d5')

function createModel (Model, doc) {
  const d = new Model(doc)
  d.save(err => {
    if (err) return false
    console.log('createModel')
    console.log(`Model(${JSON.stringify(doc)}): saved`)
  })
}
function printModel (Model) {
  Model.find({}).exec((err, docs) => {
    if (err) return false
    console.log('printModel')
    console.log(docs)
  })
}
function userTokens (id) {
  AuthTokens.find({ user: id }, (err, arr) => {
    if (err) return false
    console.log('userTokens')
    console.log(arr)
  })
}
