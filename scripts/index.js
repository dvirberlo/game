'use strict'

import fs from 'fs'
/**
 * TODO: any type of simple the queryUpdate system (queryUpdate table/function).
 * till then- there are the basics:
 * push item in array:  update= {$push: {[array]: value}}
 * set value of object: update= {$set: {[object.key]: value}}
 *
 * set value of objet in array by objId:
 *      query= {username: username, array.objId: objId} update= {$set: {array.$.key: value}}
 *
 */

import * as db from '../lib/db.js'
import * as server from '../lib/server.js'
import * as ws from '../lib/ws.js'
import path from 'path'
// database

export const missions = JSON.parse(fs.readFileSync('public/static/data/missions.json', 'utf8'))

process.debug = true
process.on('exit', code => {
  if (process.debug) console.log(`About to exit with code ${code}`)
})

db.start({ db: 'magic-bamba', collection: 'herokutest' }, err => {
  if (err) throw new Error('could connect db')
  const https = server.start(path.join(path.resolve(), 'public/'), process.env.PORT || 5000)
  ws.start(https)
})
