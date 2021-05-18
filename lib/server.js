import express from 'express'
import path from 'path'

import * as valid from './valid.js'
import * as db from './db.js'
let app
export const start = (dir, port) => {
  app = express()
  app.use(express.static(path.join(dir, 'static')))
  app.set('views', dir)
  app.set('view engine', 'ejs')
  app.get('/', (req, res) => res.render('index'))
  app.get('/game', (req, res) => res.render('game'))
  app.get('/usernameCheck', usernameCheckRequest)
  app.get('/signup', signupRequest)
  return app.listen(port, () => {
    if (process.debug) console.log(`express server started on port ${port}`)
  })
}

// /usernameCheck request
function usernameCheckRequest (req, res) {
  // invalid username act as exist
  if (!valid.usernameValid(req.query.username)) res.json(false)
  // return the opposit: if this usernmae already exists (exist- false, unexist- true)
  else {
    db.readByUsername(req.query.username, (err, result) => {
      if (err) throw err
      else res.json(!result)
    })
  }
}
// /signup request
function signupRequest (req, res) {
  // if invalid- response failue
  if (!valid.inputsValid(req.query.username, req.query.password)) res.json(false)
  // else- create new user
  else {
    db.newUser(req.query.username, req.query.password, err => {
      res.json(!err)
    })
  }
}
