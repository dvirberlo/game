'use strict'

// ;(function () {
  const MODULE = 'map'

  let lib

  let $bar
  let mission

  let loader
  const cellsLoader = {}
  let container
  let resources
  const cells = []

  window[MODULE] = { pixiSetup, show }

  // ----- pre-show: -----
  function barSetup () {
    $bar.find('#mapRoll').click(() => showCube(Math.floor(Math.random() * 6) + 1))
    $bar.find('#mapQuit').click(quit)
  }

  function pixiSetup (gLib, app, path, con, bar) {
    lib = gLib
    loader = app.loader
    resources = app.loader.resources[path]
    container = con
    $bar = bar

    barSetup()
  }

  // ----- actions: -----
  function quit () {
    $.ajax('/protected/mission/quit').done(data => lib.pixi.exit(true))
  }

  function move (cellId) {
    const object = cells[cellId].object
    $.ajax({ url: '/protected/mission/move/' + cellId, data: object }).done(user => {
      lib.nav.update(user)
      if (object) {
        lib.prompt.object(object)
        if (object.type === 'enemy') return lib.pixi.showArena(true, mission, object)
      }
      show(user.currentMission)
    })
  }

  // ----- on-show: -----
  function load (callback) {
    const path = `/images/game/map/${mission.map}/`
    const loadCells = () => new Promise((resolve, reject) => {
      if (!cellsLoader[mission.map]) {
        $.getJSON(path + 'map.cells.json').done(data => {
          cellsLoader[mission.map] = data
          resolve()
        })
      } else resolve()
    })
    const loadGraphics = () => new Promise((resolve, reject) => {
      if (!loader.resources[path + 'map.json']) loader.add(path + 'map.json').load(resolve)
      else resolve()
    })
    window.Promise.allSettled([loadCells(), loadGraphics()]).then(() => callback(loader.resources[path + 'map.json']))
  }
  function show (newMission) {
    mission = newMission.mission
    mission.progress = newMission.progress
    load(drawMap)
  }
  function reset () {
    container.removeChildren()
    cells.splice(0)
    $bar.find('#mapCube').text('')
    $bar.find('#mapRoll').prop('disabled', false)
  }

  // ----- drawings: -----
  function drawMap (mapResources) {
    reset()
    drawBackground(mapResources)
    drawCells(mapResources)
    drawPlayer()
  }
  function drawBackground (mapResources) {
    const background = new PIXI.Sprite(mapResources.textures['background.png'])
    background.zIndex = -999
    container.addChild(background)
  }
  function drawCells (mapResources) {
    $.each(cellsLoader[mission.map], (key, options) => {
      const cellCon = new PIXI.Container()
      cells[options.id] = cellCon

      // cell
      const cell = new PIXI.Sprite(mapResources.textures['cell.png'])
      cellCon.addChild(cell)

      // object
      if (options.object && !mission.progress.emptyCells.includes(options.id)) drawObject(options.object)
      function drawObject (obj) {
        const object = new PIXI.Sprite(resources.textures[obj.type + '.png'])
        object.zIndex = 1
        cellCon.addChild(object)

        cellCon.object = obj
      }

      cellCon.x = options.x
      cellCon.y = options.y
      container.addChild(cellCon)
    })
  }
  function drawPlayer () {
    const player = new PIXI.Sprite(resources.textures['player.png'])
    cells[mission.progress.currentCell].addChild(player)
  }

  function showCube (steps) {
    $bar.find('#mapRoll').prop('disabled', true)
    $bar.find('#mapCube').text(steps)

    for (const cellId of getAllowedCell(steps)) {
      const arrow = new PIXI.Sprite(resources.textures['arrow.png'])
      arrow.zIndex = 2
      arrow.cellId = cellId
      arrow.interactive = true
      arrow.buttonMode = true
      arrow.on('pointerdown', () => move(cellId))
      cells[cellId].addChild(arrow)
    }
  }
  function getAllowedCell (steps) {
    const allowed = []
    for (const index in cells) if (Math.abs(mission.progress.currentCell - index) === steps) allowed.push(index)
    return allowed
  }
// })()
