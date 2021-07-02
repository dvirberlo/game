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

  window[MODULE] = { setup, pixiSetup, show }

  function setup () {
    // TODO
  }

  function pixiSetup (gLib, app, path, con, bar) {
    lib = gLib
    loader = app.loader
    resources = app.loader.resources[path]
    container = con
    $bar = bar
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
