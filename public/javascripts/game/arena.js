'use strict'

;(function () {
  const MODULE = 'arena'

  let lib

  let $bar
  let mission
  let enemy

  let loader
  let resources
  let container

  window[MODULE] = { pixiSetup, show }

  // ----- pre-show: -----
  function barSetup () {
    $bar.find('#arenaQuit').click(quit)
    // TODO
  }

  function pixiSetup (gLib, app, path, con, bar) {
    lib = gLib
    loader = app.loader
    resources = app.loader.resources[path]
    container = con
    $bar = bar

    barSetup()
    // TODO
  }
  // ----- actions: -----
  function quit () {
    window.alert('quit')
  }

  // ----- on-show: -----
  function load (callback) {
    // TODO
    callback()
  }
  function show (newMission, object) {
    mission = newMission
    enemy = object
    // TODO
    load(drawArena)
  }
  function reset () {
    container.removeChildren()
    // TODO
  }

  // ----- drawings: -----
  function drawArena (arenaResources) {
    reset()
    // TODO
  }
})()
