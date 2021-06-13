'use strict'

;(function () {
  let mapCallback
  let missionId
  const $mission = $('#mission')

  window.mission = { setup, reset }

  function reset (script, showMap) {
    mapCallback = showMap
    another()
  }

  function setup () {
    $mission.find('#missionEnter').click(enter)
    $mission.find('#missionAnother').click(another)

    function enter () {
      $.ajax('/protected/mission/enter/' + missionId).done(data => {
        mapCallback(data)
      })
    }
  }
  function another () {
    $.ajax('/protected/mission').done(data => {
      missionId = data._id
      $mission.find('#missionText').text(data.description)
    })
  }
})()
