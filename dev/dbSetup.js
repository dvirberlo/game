'use strict'

const mongoose = require('mongoose')
require('dotenv').config()
const User = require('../models/user')
const AuthTokens = require('../models/authToken')

// mongoose connection setup
mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error: '))

// because program is ansyc:
console.log('NOTE: terminate the program when you see its done')

// createUser(User, {username: 'user', password: 'pass'})
printModel(AuthTokens)
printModel(User)
userTokens('60b0ddc89fb70f2770c0c798')

function createUser (Model, doc) {
  const d = new Model(doc)
  d.save(err => {
    if (err) return false
    console.log('createUser')
    console.log(`User(${JSON.stringify(doc)}): saved`)
  })
}
function printModel (Model) {
  Model.find({}).exec((err, arr) => {
    if (err) return false
    console.log('printModel')
    console.log(arr)
  })
}
function userTokens (id) {
  AuthTokens.find({ user: id }, (err, arr) => {
    if (err) return false
    console.log('userTokens')
    console.log(arr)
  })
}
