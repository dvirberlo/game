'use strict'

const mongoose = require('mongoose')
require('dotenv').config()
const User = require('../models/user')

// mongoose connection setup
mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('error', console.error.bind(console, 'MongpDB connection error:'))

// because program is ansyc:
console.log('NOTE: terminate the program when you see its done')

// createUser({username: 'user', password: 'pass'})
printUsers()
// printUsersAtr('authTokens')

function createUser (user) {
  // costumize your users carefully: there is no duplication check here!
  const u = new User(user)
  u.save(err => {
    if (err) console.error(`createUser(${JSON.stringify(user)}) error: ${err}`)
    else console.log(`User(${JSON.stringify(user)}): saved`)
  })
}
function printUsers () {
  User.find({}).exec((err, arr) => {
    if (err) console.error(err)
    else console.log(arr)
  })
}
function printUsersAtr (atr) {
  User.find({}).exec((err, arr) => {
    if (!err) for (const user of arr) console.log(user.username + ':' + user[atr])
  })
}
