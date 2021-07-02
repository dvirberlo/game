'use strict'

;(function () {
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

  function barSetup () {
    $bar.find('#mapRoll').click(() => showCube(Math.floor(Math.random() * 6) + 1))
    $bar.find('#mapQuit').click(() => $.ajax('/protected/mission/quit').done(data => lib.pixi.exit()))
  }

  function pixiSetup (gLib, app, path, con, bar) {
    lib = gLib
    loader = app.loader
    resources = app.loader.resources[path]
    container = con
    $bar = bar
    
    barSetup()
  }

  function show (newMission) {
    mission = newMission.mission
    mission.progress = newMission.progress

    const path = `/images/game/map/${mission.map}/${mission.map}.json`
    if (!loader.resources[path]) loader.add(path).load(() => drawMap(loader.resources[path]))
    else drawMap(loader.resources[path])
  }
  function reset () {
    container.removeChildren()
    cells.splice(0)
    $bar.find('#mapCube').text('')
    $bar.find('#mapRoll').prop('disabled', false)
  }
  function drawMap (mapResources) {
    reset()

    // background
    const background = new PIXI.Sprite(mapResources.textures['background.png'])
    background.zIndex = -999
    container.addChild(background)

    // cells
    if (!cellsLoader[mission.map]) $.getJSON({ url: `/images/game/map/${mission.map}/${mission.map}.cells.json`, async: false }).done(data => { cellsLoader[mission.map] = data })
    $.each(cellsLoader[mission.map], (key, cellOpts) => drawCell(cellOpts))

    // player
    const player = new PIXI.Sprite(resources.textures['player.png'])
    cells[mission.progress.currentCell].addChild(player)

    function drawCell (options) {
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
    }
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
  function move (cellId) {
    const object = cells[cellId].object
    $.ajax({ url: '/protected/mission/move/' + cellId, data: object }).done(user => {
      lib.nav.update(user)
      if (object) {
        lib.prompt.object(object)
        if (object.type === 'enemy') return lib.pixi.showArena(mission, object)
      }
      show(user.currentMission)
    })
  }
})()
