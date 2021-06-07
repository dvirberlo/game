'use strict'

// ;(function () {
const $mapMenu = $('#map')
let homeCallback, mapCube

window.map = { setup, show }

function setup () {
  const $roll = $mapMenu.find('#mapRoll')
  $roll.click(roll)
  $mapMenu.find('#mapQuit').click(quit)

  $mapMenu.hide()

  function roll () {
    $roll.prop('disabled', true)
    const steps = Math.floor(Math.random() * 6) + 1
    $mapMenu.find('#mapCube').text(steps)
    mapCube(steps)
  }
  function quit () {
    $.ajax('/protected/mission/quit').done(data => {
      $mapMenu.hide()
      homeCallback()
    })
  }

  PIXI.loader.add('/images/map.json')
}
function show (app, mission, showHome) {
  homeCallback = showHome
  console.log(mission)
  $mapMenu.show()
  drawMap(app, mission)
  mapCube = move => {
    // TODO
  }
}

function drawMap (app, mission) {
  // TODO
}
// })()
