'use strict'

;(function () {
  const $mapMenu = $('#pixi')
  let homeCallback
  let mission
  let container
  let resources
  const cells = []

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

  function show (m, showHome) {
    reset()

    mission = m
    homeCallback = showHome
    $mapMenu.show()
    drawMap()
  }
  function reset () {
    mission = undefined
    homeCallback = undefined
    container.removeChildren()
    cells.splice(0)
    $mapMenu.find('#mapCube').text('')
    $mapMenu.find('#mapRoll').prop('disabled', false)
  }
  function drawMap () {
    for (const index in mission.map.cells) {
      const cellCon = new PIXI.Container()
      cells[index] = cellCon
      const cell = new PIXI.Sprite(resources.textures['cell.png'])

      cellCon.y = 200
      cellCon.x = index * (cell.width + 20)
      console.log(mission.map.objects[index])
      // (TODO: draw object on each cell)

      cellCon.addChild(cell)
      container.addChild(cellCon)
    }
  }
  function mapCube (steps) {
    for (const index in getAllowedCell(steps)) {
      // const arrow = new PIXI.Sprite(resources.textures['arrow.png'])
      // TODO
      console.log(index)
    }
  }
  function getAllowedCell (steps) {
    const allowed = []
    for (const index in mission.map.cells) if (Math.abs(mission.progress.currentCell - index) === steps) allowed.push(index)
    return allowed
  }
})()
