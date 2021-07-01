'use strict'

;(function () {
  const $pixi = $('#pixi')
  let app
  const containers = {}
  const bars = {}

  window.pixi = { setup, postLoad, showMap }

  function setup () {
    app = new window.PIXI.Application()
    $pixi.find('#pixiView').append(app.view)

    $pixi.hide()
  }

  async function postLoad (lib) {
    pixiLoad(['map', 'arena'])

    function pixiLoad (names) {
      const getPath = (name) => `/images/game/${name}/${name}.json`

      for (const name of names) app.loader.add(getPath(name))
      app.loader.load(() => {
        for (const name of names) {
          const con = new PIXI.Container()
          containers[name] = con
          const bar = $('#' + name + 'Bar')
          bars[name] = bar

          lib[name].pixiSetup(lib, app, getPath(name), con, bar)
        }
      })
    }
  }

  function hide (showHome) {
    app.stage.removeChildren()
    $.each(bars, (key, $e) => $e.hide())

    if (typeof showHome === 'function') {
      $pixi.hide()
      showHome()
    }
  }
  function showMap (lib, mission, showHome) {
    hide()
    app.stage.addChild(containers.map)
    bars.map.show()
    lib.map.show(mission, showArena, () => hide(showHome))
    $pixi.show()
  }
  function showArena (lib, mission, showHome) {
    hide()
    app.stage.addChild(containers.arena)
    bars.arena.show()
    lib.arena.show(mission, showMap, () => hide(showHome))
    $pixi.show()
  }
})()
