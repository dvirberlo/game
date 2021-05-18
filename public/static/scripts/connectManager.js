'use strict'
/**
 * all code should be unreachable to browser's debugger console:
 * !function{}(...game.js:varible = connectManager;...);
 * it is just development right now, so it is not like that.
 */

const coockiesExpire = 365 * 100
let codesTable
let ws
let gameMode = false
window.connectManager = {
  createWS: function (callback) {
    ws = new window.WebSocket(window.connectManager.wsPath)
    // get codesTable from server
    ws.onmessage = function (event) {
      codesTable = wsParse(event.data)
      ws.onmessage = null
      callback()
    }
  },
  tryCoockiesLogin: function (callback) {
    const username = readCookie('username')
    const password = readCookie('password')

    window.connectManager.login(username, password, callback)
  },
  login: function (username, password, callback) {
    const code = codesTable.login
    ws.onmessage = wsOnMessage(code, function (res) {
      if (res) {
        writeCookie('username', username)
        writeCookie('password', password)
      }
      callback(res)
    })
    wsSend({ code: code, username: username, password: password })
  },
  checkUsernameAvailable: function (username, callback) {
    $.ajax({
      method: 'GET',
      url: '/usernameCheck',
      data: { username: username }
    })
      .done(msg => {
        callback(username, ajaxParse(msg))
      })
      .fail(err => {
        // LOGDEV
        console.log('error: ')
        console.log(err)

        callback(username, false)
      })
  },
  signup: function (username, password, callback) {
    $.ajax({
      method: 'GET',
      url: '/signup',
      data: { username: username, password: password }
    })
      .done(msg => {
        if (ajaxParse(msg)) {
          writeCookie('username', username)
          writeCookie('password', password)
          callback(null)
        } else callback(new Error('signup failed'))
      })
      .fail(err => {
        // LOGDEV
        console.log('error: ')
        console.log(err)

        callback(username, false)
      })
  },

  // game
  getData: function (callback) {
    const code = codesTable.getData
    ws.onmessage = wsOnMessage(code, callback)
    wsSend({ code: code })
  },
  enterGameMode: function (callback) {
    gameMode = ws.addEventListener('message', function (event) {
      const data = wsParse(event.data)
      if (data.code === codesTable.gameMode) {
        callback(data.response.key, data.response.value)
      }
    })
  },
  missionMove: function (movement, callback) {
    const code = codesTable.missionMove
    ws.onmessage = wsOnMessage(code, callback)
    wsSend({ code: code, request: movement })
  },
  quitMission: function (callback) {
    const code = codesTable.quitMission
    ws.onmessage = wsOnMessage(code, callback)
    wsSend({ code: code })
  },
  enterMission: function (callback) {
    const code = codesTable.enterMission
    ws.onmessage = wsOnMessage(code, callback)
    wsSend({ code: code })
  },
  enterBattle: function (callback) {
    const code = codesTable.enterBattle
    ws.onmessage = wsOnMessage(code, callback)
    wsSend({ code: code })
  },
  anotherMission: function (callback) {
    const code = codesTable.anotherMission
    ws.onmessage = wsOnMessage(code, callback)
    wsSend({ code: code })
  },
  exit: function () {
    // TODO
    ws.removeEventListener(gameMode)
  },
  pongTime: 10000
}

function wsSend (obj) {
  // TODO: handle network issues
  if (ws.readyState === window.WebSocket.OPEN) ws.send(wsStringify(obj))
  else {
    // TODO
    // LOGDEV
    console.log('wsSend error')
  }
}

function wsStringify (obj) {
  return JSON.stringify(obj)
}
function wsParse (data) {
  return JSON.parse(data)
}
function ajaxParse (data) {
  return JSON.parse(data)
}
// function connectionError () {
//   // LOGDEV
//   console.log('connection error')
//   // TODO
//   callback(false)
// }
function wsOnMessage (code, callback) {
  return event => {
    const data = wsParse(event.data)
    // (TODO: is it needed to use eventListener to multy request support?)
    if (data.code === code) {
      ws.onmessage = null
      callback(data.response)
    }
  }
}

// ----- coockies functions -----
function writeCookie (cname, cvalue, days = coockiesExpire) {
  const d = new Date()
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000))
  const expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}
function readCookie (cname) {
  const name = cname + '='
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}
