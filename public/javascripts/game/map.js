'use strict'

// ;(function () {
const $mapMenu = $('#pixi')
let homeCallback
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

function pixiSetup (app, path, con) {
  loader = app.loader
  resources = app.loader.resources[path]
  container = con
}

function show (newMission, showHome = homeCallback) {
  mission = newMission.mission
  mission.progress = newMission.progress
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
    const cell = new PIXI.Sprite(mapResources.textures['cell.png'])

    cellCon.x = options.x
    cellCon.y = options.y
    // TODO: draw object on each cell

    cellCon.addChild(cell)
    container.addChild(cellCon)
  }
}
function mapCube (steps) {
  for (const cellId of getAllowedCell(steps)) {
    const arrow = new PIXI.Sprite(resources.textures['arrow.png'])
    arrow.anchor.set(-0.5, 0)
    arrow.cellId = cellId
    arrow.interactive = true
    arrow.buttonMode = true
    arrow.on('pointerdown', () => move(cellId))
    cells[cellId].addChild(arrow)
  }
}
function move (cellId) {
  $.ajax('/protected/mission/move/' + cellId).done(data => show(data))
}
function getAllowedCell (steps) {
  const allowed = []
  for (const index in cells) if (Math.abs(mission.progress.currentCell - index) === steps) allowed.push(index)
  return allowed
}
// })()
