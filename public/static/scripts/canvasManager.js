'use strict'
/**
 * all code should be unreachable to browser's debugger console:
 * !function{}(...game.js:varible = canvasManager;...);
 * it is just development right now, so it is not like that.
 */
// const view = ''
const data = {}
// let canvasDiv; const width = 800; const height = 600
window.canvasManager = {
  load: function () {
    // TODO
  },
  setCanvas: function (canvas) {
    // canvasDiv = canvas
  },
  setData: function (key, value) {
    data[key] = value
  },
  setSize: function (newWidth, newHeight) {
    // TODO
  },
  showGuide: function (callback) {
    // TODO
    callback()
  },
  showHome: function (buyClothes, buySpell, enterMission) {
    // TODO
  },
  showMission: function (missionMove, missionQuit) {
    // TODO
  },
  clear: function () {
    // TODO
  }
}
