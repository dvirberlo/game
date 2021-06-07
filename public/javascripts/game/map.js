'use strict'

;(function () {
  const $mapMenu = $('#pixi')
  let homeCallback, mapCube
  let container
  let resources

  window.map = { setup, pixiSetup, show }

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
  }

  function pixiSetup (app, path, con) {
    resources = app.loader.resources[path]
    container = con
  }

  function show (mission, showHome) {
    reset()
    homeCallback = showHome
    $mapMenu.show()
    drawMap(mission)
    mapCube = move => {
      // TODO
    }
  }
  function reset () {
    container.removeChildren()
    $mapMenu.find('#mapCube').text('')
    $mapMenu.find('#mapRoll').prop('disabled', false)
  }
  function drawMap (mission) {
    // TODO
    container.addChild(new PIXI.Sprite(resources.textures['arrow.png']))
  }
})()
