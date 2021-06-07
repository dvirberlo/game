'use strict'

;(function () {
  const $pixi = $('#pixi')
  let app

  window.pixi = { setup, postLoad, showMap }

  function setup () {
    app = new window.PIXI.Application()
    $pixi.find('#pixiView').append(app.view)

    $pixi.hide()
  }

  function postLoad (scripts) {
    scripts.map.load(app)
  }

  function showMap (scripts, mission, showHome) {
    scripts.map.show(app, mission, () => {
      $pixi.hide()
      showHome()
    })
    $pixi.show()
  }
})()
