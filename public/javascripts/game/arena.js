'use strict'
/* . ,-<--<--<--<--<--<--<--<--<--<--<--<--<--<--<-
 * \/                                             ^
 * preview ( is dead? user-> lose, enemy-> win -- | -----> showMap() )
 * get user moves (html choose)                   ^
 * get enemy moves (AI)                           |
 * --->--->--->--->--->--->--->--->--->--->--->---^
 */
// ;(function () {
const MODULE = 'arena'

let lib

let $bar
let mission
let enemy
let state

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
  const path = `/images/game/map/${mission.map}/`
  const loadGraphics = () => new Promise((resolve, reject) => {
    if (!loader.resources[path + 'arena.json']) loader.add(path + 'arena.json').load(resolve)
    else resolve()
  })
  window.Promise.allSettled([loadGraphics()]).then(() => callback(loader.resources[path + 'map.json']))
}
function show (newBattle, newMission, object) {
  if (newBattle) hardReset(newMission, object)
  // TODO
  load(drawArena)
}
function hardReset (newMission, object) {
  state = { player: { hp: 100, x: 0, y: 1 }, enemy: { hp: 100, x: 3, y: 1 } }
  mission = newMission
  enemy = object
}
function reset () {
  container.removeChildren()

  $bar.find('#arenaPlayerHP').text(state.player.hp)
  $bar.find('#arenaEnemyHP').text(state.enemy.hp)

  $bar.find('#arenaEnemyName').text(enemy.type)
}

// ----- drawings: -----
function drawArena (arenaResources) {
  reset()
  // TODO
}
// })()
