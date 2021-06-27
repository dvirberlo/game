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

  function postLoad (lib) {
    pixiLoad('map')

    function pixiLoad (name) {
      const path = `/images/game/${name}/${name}.json`
      app.loader.add(path).load(() => {
        const con = new PIXI.Container()
        containers[name] = con
        lib[name].pixiSetup(app, path, con)
      })
    }
  }

  function showMap (lib, mission, showHome) {
    app.stage.addChild(containers.map)
    lib.map.show(mission, () => {
      app.stage.removeChild(containers.map)
      $pixi.hide()
      showHome()
    })
    $pixi.show()
  }
})()
