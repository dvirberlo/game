'use strict'

const mongoose = require('mongoose')
require('dotenv').config()
const User = require('../models/user')

// mongoose connection setup
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true , useUnifiedTopology: true})
mongoose.connection.on('error', console.error.bind(console, 'MongpDB connection error:'))

// because program is ansyc:
console.log('NOTE: terminate the program when you see its done (all "saved")')

// createUser({username: 'user', password: 'pass'})
printUsers()

function createUser(user){
  // costumize your users carefully: there is no duplication check here!
  const u = new User(user)
  u.save(err => {
    if (err) console.error(`createUser(${JSON.stringify(user)}) error: ${err}`)
    else console.log(`User(${JSON.stringify(user)}): saved`)
  })
}
function printUsers(){
  User.find({}).exec((err, arr) => {
    if (err) console.error(err)
    else console.log(arr)
  })
}
