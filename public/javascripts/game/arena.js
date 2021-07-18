'use strict'
/* . ,-<--<--<--<--<--<--<--<--<--<--<--<--<--<--<-
 * \/                                             ^
 * preview ( is dead? user-> lose, enemy-> win -- | -----> showMap() )
 * get user moves (html choose)                   ^
 * get enemy moves (AI)                           |
 * --->--->--->--->--->--->--->--->--->--->--->---^
 */
;(function () {
  const MODULE = 'arena'

  let lib

  let $bar
  let mission
  let enemy
  let state

  let loader
  let resources
  let container
  const spellsResource = {}

  const grid = []

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
    $.ajax('/protected/mission/quit').done(data => lib.pixi.exit(true))
  }

  // ----- on-show: -----
  function load (callback) {
    const path = `/images/game/map/${mission.map}/arena.json`
    const loadGraphics = () => new Promise((resolve, reject) => {
      const enemyPath = `/images/game/enemy/${enemy.id}.png`
      if (!loader.resources[path]) loader.add(path).add(enemyPath).load(resolve)
      else resolve()
    })
    Promise.allSettled([loadGraphics()]).then(() => callback(loader.resources[path]))
  }
  function show (newBattle, newMission, newEnemy, newState, moves) {
    state = newState
    if (newBattle) hardReset(newMission, newEnemy)
    load(res => drawArena(res, moves))
  }
  function hardReset (newMission, newEnemy) {
    state = { player: { hp: 100, x: 0, y: 1 }, enemy: { hp: 100, x: 3, y: 1 } }
    mission = newMission
    enemy = newEnemy
  }
  function reset () {
    container.removeChildren()
    grid.splice(0)

    $bar.find('#arenaPlayerHP').text(state.player.hp)
    $bar.find('#arenaEnemyHP').text(state.enemy.hp)
    $bar.find('#arenaEnemyName').text(enemy.type)
  }

  // ----- drawings: -----
  function drawArena (arenaResources, moves) {
    reset()

    drawBackground(arenaResources)
    drawGrid(arenaResources)
    drawPlayer()
    drawEnemy()

    const callback = () => setTimeout(() => lib.playerMove.show(mission, state, enemy), 5000)
    if (moves) animateMoves(moves, callback)
    else callback()
  }
  function drawBackground (arenaResources) {
    const background = new PIXI.Sprite(arenaResources.textures['background.png'])
    background.zIndex = -999
    container.addChild(background)
  }
  function drawGrid (arenaResources) {
    const width = 4
    const xSize = 800 / width
    const heigth = 3
    const ySize = 600 / heigth
    for (let y = 0; y < heigth; y++) {
      grid.push([])
      for (let x = 0; x < width; x++) {
        const cellCon = new PIXI.Container()
        grid[y][x] = cellCon
        cellCon.x = x * xSize
        cellCon.y = y * ySize
        const cell = new PIXI.Sprite(arenaResources.textures['cell.png'])
        cellCon.addChild(cell)
        container.addChild(cellCon)
      }
    }
  }
  function drawPlayer () {
    const player = new PIXI.Sprite(resources.textures['player.png'])
    grid[state.player.y][state.player.x].addChild(player)
  }
  function drawEnemy () {
    const enemy = new PIXI.Sprite(resources.textures['enemy.png'])
    grid[state.enemy.y][state.enemy.x].addChild(enemy)
  }
  function animateMoves (arenaResources, moves, callback) {
    for (let i = 0; i < moves.player.length; i++) {
      moveSprite('player', moves.player[i])
      moveSprite('enemy', moves.enemy[i])
      if (i === moves.player.length - 1) callback()
    }
  }
  // const arrows = { left: -1, down: -2, right: -3, up: -4 }
  function moveSprite (sprite, moveId) {
    if (moveId > 0) {
      // arrow move
      const angle = moveId * 0.5 * Math.PI
      if (Math.abs(Math.sin(angle))) state[sprite].x = Math.sin(angle)
      else state[sprite].x = Math.cos(angle)
    } else {
      loadSpell(moveId, spell => {
        for (const cell of spell.cells) {
          for (const sprt of state) if (sprt !== sprite && state[sprt].x === cell.x && state[sprt].y === cell.y) state[sprt].hp -= spell.power
        }
      })
    }
  }
  function loadSpell (spellId, callback) {
    if (spellsResource[spellId]) return callback(spellsResource[spellId])
    else {
      $.getJSON(`/images/spell/${spellId}/spell.json`).done(json => {
        spellsResource[spellId] = json
        return callback(spellsResource[spellId])
      })
    }
  }
})()
