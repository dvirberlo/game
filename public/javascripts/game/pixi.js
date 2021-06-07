'use strict'

// ;(function () {
const $pixi = $('#pixi')
let app
setup()

window.pixi = { showMap }

function setup () {
  app = new window.PIXI.Application()
  $pixi.find('#pixiView').append(app.view)

  $pixi.hide()
}
function showMap (scripts, mission, showHome) {
  scripts.map.show(app, mission, () => {
    $pixi.hide()
    showHome()
  })
  $pixi.show()
}
// })()
