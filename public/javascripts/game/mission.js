'use strict'

// ;(function () {

window.mission = { reset }

let mapCallback
let missionId
const $mission = $('#mission')

setup()

function reset (script, showMap) {
  $mission.find('#missionText').text('')
  mapCallback = showMap
  another()
}

function setup () {
  $mission.find('#missionEnter').click(enter)
  $mission.find('#missionAnother').click(another)

  function enter () {
    $.ajax('/protected/mission/enter/' + missionId).done(data => {
      mapCallback(data)
    })
  }
}
function another () {
  $.ajax('/protected/mission').done(update)
}
function update (data) {
  missionId = data._id
  $mission.find('#missionText').text(data.description)
}
// })()
