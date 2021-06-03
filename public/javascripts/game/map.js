'use strict'

const $map = $('#map')
let homeCallback
let app
setup()

window.map = { show }

function setup () {
  $map.find('#mapQuit').click(quit)

  app = new window.PIXI.Application()
  $map.find('#mapPixi').append(app.view)

  $map.hide()

  function quit () {
    $.ajax('/protected/mission/quit').done(data => {
      $map.hide()
      homeCallback()
    })
  }
}
function show (scripts, mission, showHome) {
  homeCallback = showHome
  $map.show()
}
