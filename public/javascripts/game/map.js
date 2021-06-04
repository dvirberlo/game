'use strict'

const $map = $('#map')
const $roll = $map.find('#mapRoll')
let homeCallback, mapMove
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
    const move = Math.floor(Math.random() * 6) + 1
    $map.find('#mapCube').text(move)
    mapMove(move)
  }
}
function show (scripts, mission, showHome) {
  homeCallback = showHome
  $map.show()
  mapMove = move => {
  }
}
