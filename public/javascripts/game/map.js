'use strict'

// ;(function () {
const $map = $('#map')
const $roll = $map.find('#mapRoll')
let homeCallback, mapCube
let app
setup()

window.map = { show }

function setup () {
  $map.find('#mapQuit').click(quit)
  $roll.click(roll)

  app = new window.PIXI.Application()
  $map.find('#mapPixi').append(app.view)

  $map.hide()

  function quit () {
    $.ajax('/protected/mission/quit').done(data => {
      $map.hide()
      homeCallback()
    })
  }
  function roll () {
    $roll.prop('disabled', true)
    const steps = Math.floor(Math.random() * 6) + 1
    $map.find('#mapCube').text(steps)
    mapCube(steps)
  }
}
function show (scripts, mission, showHome) {
  homeCallback = showHome
  console.log(mission)
  $map.show()
  mapCube = move => {
  }
}
// })()
