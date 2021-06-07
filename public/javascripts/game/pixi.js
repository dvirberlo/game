'use strict'

;(function () {
  const $pixi = $('#pixi')
  let app
  const containers = {}

  window.pixi = { setup, postLoad, showMap }

  function setup () {
    app = new window.PIXI.Application()
    $pixi.find('#pixiView').append(app.view)

    $pixi.hide()
  }

  function postLoad (scripts) {
    pixiLoad('map')

    function pixiLoad (name) {
      const path = `/images/game/${name}.json`
      app.loader.add(path).load(() => {
        const con = new PIXI.Container()
        containers[name] = con
        scripts[name].pixiSetup(app, path, con)
      })
    }
  }

  function showMap (scripts, mission, showHome) {
    app.stage.addChild(containers.map)
    scripts.map.show(mission, () => {
      app.stage.removeChild(containers.map)
      $pixi.hide()
      showHome()
    })
    $pixi.show()
  }
})()
