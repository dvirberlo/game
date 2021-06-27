'use strict'

;(function () {
  let lib
  let mapCallback
  let homeCallback
  let mission

  let loader
  let resources
  let container

  window.arena = { setup, pixiSetup, show }

  function setup () {
    // TODO
  }

  function pixiSetup (gLib, app, path, con) {
    lib = gLib
    loader = app.loader
    resources = app.loader.resources[path]
    container = con
    // TODO
  }

  function show (newMission, showMap = mapCallback, showHome = homeCallback) {
    mission = newMission
    mapCallback = showMap
    homeCallback = showHome
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
