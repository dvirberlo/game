'use strict'

import '../lib/preload.js'
import * as db from '../lib/db.js'
import * as server from '../lib/server.js'
import * as ws from '../lib/ws.js'
import path from 'path'
// import fs from 'fs'

// const missions = JSON.parse(fs.readFileSync('public/static/data/missions.json', 'utf8'))

process.on('exit', code => {
  if (process.debug) console.log(`About to exit with code ${code}`)
})

db.start({ db: 'magic-bamba', collection: 'herokutest' }, err => {
  if (err) throw new Error('could connect db')
  const https = server.start(path.join(path.resolve(), 'public/'), process.env.PORT || 5000)
  ws.start(https)
})
