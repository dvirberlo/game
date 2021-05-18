import WebSocket from 'ws'

import * as valid from './valid.js'
import * as db from './db.js'

const maxMsgLenght = 1000
const codesTable = {
  login: 0,
  getData: 1,
  missionMove: 2,
  quitMission: 3,
  enterMission: 4,
  gameMode: 9,
  enterBattle: 10,
  battleAttack: 11,
  quitBattle: 12,
  anotherMission: 13
}

let wss
export const start = app => {
  wss = new WebSocket.Server({ server: app })
  if (process.debug) console.log(`ws server started on port ${app.address().port}`)
  wss.on('connection', (ws, req, client) => {
    // on connection send codes table
    wsSend(codesTable, ws)

    // open ws for requests
    ws.isActive = true
    // ws was not logged in yet
    ws.username = false

    ws.on('message', (msg) => {
      // check if opened to requests
      if (!ws.isActive) return false

      // check if message is not too long
      let message = msg.toString()
      if (message.length > maxMsgLenght) {
        // LOGDEV
        wsSend('maxMsgLenght', ws)
        return ws.terminate()
      }
      // parse message
      message = wsParse(message)
      // disable react requests till there is a response
      ws.isActive = false
      // callback with response
      wsSwitchCodes(message, ws, (err, res) => {
        // send the response with the request code
        if (!err) wsSend({ code: message.code, response: res }, ws)
        else wsSend({ code: message.code, response: false }, ws)
        // reopen ws for requests
        ws.isActive = true
      })
    })
    ws.on('close', () => {
      // on close
      ws.terminate()
    })
  })
}

function wsSwitchCodes (message, ws, callback) {
  switch (message.code) {
    case codesTable.login:
      loginRequest(message.username, message.password, ws, callback)
      break

    case codesTable.getData:
      getDataRequest(ws, callback)
      break
      // mission and battle: enter and quit
    case codesTable.setMission:
      gameUpdate('mission', message.request, ws, callback)
      break
    case codesTable.setBattle:
      gameUpdate('mission.battle', message.request, ws, callback)
      break
      // updates
    case codesTable.missionMove:
      gameUpdate('mission.cell', message.request, ws, callback)
      break
    case codesTable.battleAttack:
      gameUpdate('mission.battle.state', message.request, ws, callback)
      break
  }
}
function loginRequest (username, password, ws, callback) {
  if (valid.inputsValid(username, password)) {
    db.loginCheck(username, password, (err, result) => {
      if (err) return callback(err)
      // if login succeeded- save username: means ws logged in.
      if (result) {
        ws.username = username
      }
      callback(err, result)
    })
  } else callback(new Error('db error'))
}
function getDataRequest (ws, callback) {
  const username = ws.username
  // only if logged in- send the data
  if (username) db.readByUsername(username, callback)
  else callback(new Error('not logged in'))
}
// function buyItemRequest (id, type, ws, callback) {
//   const username = ws.username
//   // only if logged in- buy item
//   if (username) {
//     db.checkAfford(username, data[type][id].price, (err, result, newResources) => {
//       if (err) return callback(err)
//       // only if affordable
//       if (result) {
//       // add item to list
//         const newItem = { id: id, equip: false }
//         db.updateByUsername({ username: username }, { $push: { [type]: newItem } }, callback)
//         // decrease price from resources and send new resources
//         db.setByUsername(username, 'resources', newResources, (err, result) => {
//           if (err) throw err
//           gameMode(ws, 'resources', newResources)
//         })
//       } else callback(null, false)
//     })
//   } else callback(new Error('not logged in'))
// }
// function equipItemRequest (id, value, type, ws, callback) {
//   const username = ws.username
//   // only if logged in- buy item
//   if (username) {
//     // query: username && id.
//     db.updateByUsername({ username: username, [type + '.id']: id }, { $set: { [type + '.$.equip']: value } }, callback)
//   } else callback(new Error('not logged in'))
// }

// function gameMode (ws, key, value) {
//   wsSend({ code: codesTable.gameMode, response: { key: key, value: value } }, ws)
// }
function gameUpdate (path, value, ws, callback) {
  const username = ws.username
  // only if logged in- update
  if (username) db.setByUsername(username, path, value, callback)
  else callback(new Error('not logged in'))
}

function wsSend (obj, ws) {
  // TODO: handle network issues
  if (ws.readyState === WebSocket.OPEN) ws.send(wsStringify(obj))
  else {
    // TODO
  }
}
function wsStringify (obj) {
  return JSON.stringify(obj)
}
function wsParse (data) {
  return JSON.parse(data)
}
