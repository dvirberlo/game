'use strict'

;(function () {
  const MODULE = 'playerMove'

  const $playerMove = $('#playerMove')

  let lib
  let mission
  let state
  let enemy
  let moves

  window[MODULE] = { postLoad, setup, show }

  // ----- pre-show: -----
  function postLoad (gLib) {
    lib = gLib
  }

  function setup () {
    // TODO
  }

  // ----- actions: -----
  function onMoveClick() {
    // TODO
  }

  // ----- on-show: -----
  function reset (lib, showMap) {
    moves = { player: undefined, enemy: undefined }
    // TODO
  }
  function show (newMission, newState, newEnemy) {
    reset()
    mission = newMission
    state = newState
    enemy = newEnemy

    lib.pixi.exit(false)

    lib.AI.getMoves(enemy, state, mvs => {
      if (moves.player) lib.pixi.showArea(false, mission, enemy, state, {...moves, enemy: mvs})
      else moves.enemy = mvs
    })

    getPlayerMoves(lib.manager.getUserData().spells, mvs => {
      if (moves.enemy) lib.pixi.showArea(false, mission, enemy, state, {...moves, player: mvs})
      else moves.player = mvs
    })
  }

  function getPlayerMoves(userSpells, callback) {
    // TODO
  }
})()
