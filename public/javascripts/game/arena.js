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

  function barSetup () {
    $bar.find('#arenaQuit').click(() => window.alert('quit'))
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

  function show (newMission, object) {
    mission = newMission
    enemy = object
    // TODO
  }
  function reset () {
    container.removeChildren()
    // TODO
  }
  function drawArena (arenaResources) {
    reset()
  }
})()
