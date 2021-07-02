'use strict'

;(function () {
  const MODULE = 'pixi'

  let lib
  let homeCallback

  const $pixi = $('#pixi')
  let app
  const containers = {}
  const bars = {}

  window[MODULE] = { setup, postLoad, exit, showMap, showArena }

  function setup () {
    app = new window.PIXI.Application()
    $pixi.find('#pixiView').append(app.view)

    $pixi.hide()
  }

  async function postLoad (gLib) {
    lib = gLib
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

  function hideAll () {
    app.stage.removeChildren()
    $.each(bars, (key, $e) => $e.hide())
  }
  function exit () {
    hideAll()
    $pixi.hide()
    homeCallback()
  }

  function pixiShow (name) {
    hideAll()
    app.stage.addChild(containers[name])
    bars[name].show()
    $pixi.show()
  }
  function showMap (mission, showHome) {
    homeCallback = showHome

    pixiShow('map')
    lib.map.show(mission)
  }
  function showArena (mission, object) {
    pixiShow('arena')
    lib.arena.show(mission, object)
  }
})()
