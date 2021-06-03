'use strict'

// ;(function () {

window.mission = { reset }

let mapCallback
let mission
const $mission = $('#mission')

setup()

function reset (script, showMap) {
  $mission.find('#missionText').text('')
  mapCallback = showMap
  another()
}

function setup () {
  $mission.find('#missionEnter').click(() => {
    $.ajax('/protected/mission/enter/' + mission._id).done(data => {
      mapCallback(mission)
    })
  })
  $mission.find('#missionAnother').click(another)
}
function another () {
  $.ajax('/protected/mission').done(data => {
    mission = data
    update()
  })
}
function update () {
  $mission.find('#missionText').text(mission.description)
}
// })()
