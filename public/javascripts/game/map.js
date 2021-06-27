'use strict'

;(function () {
  let lib

  const $mapMenu = $('#pixi')
  let homeCallback
  let arenaCallback
  let mission
  let loader
  const cellsLoader = {}
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

  function pixiSetup (gLib, app, path, con) {
    lib = gLib
    loader = app.loader
    resources = app.loader.resources[path]
    container = con
  }

  function show (newMission, showArena = arenaCallback, showHome = homeCallback) {
    mission = newMission.mission
    mission.progress = newMission.progress
    arenaCallback = showArena
    homeCallback = showHome
    $mapMenu.show()

    const path = `/images/game/map/${mission.map}/${mission.map}.json`
    if (!loader.resources[path]) loader.add(path).load(() => drawMap(loader.resources[path]))
    else drawMap(loader.resources[path])
  }
  function reset () {
    container.removeChildren()
    cells.splice(0)
    $mapMenu.find('#mapCube').text('')
    $mapMenu.find('#mapRoll').prop('disabled', false)
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
  function mapCube (steps) {
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
      if (object) {
        lib.prompt.object(object)
        if (object.type === 'enemy') arenaCallback(lib, mission, homeCallback)
      }

      lib.nav.update(user)
      show(user.currentMission)
    })
  }
})()
