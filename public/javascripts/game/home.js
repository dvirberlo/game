'use strict'

;(function () {
  window.home = { show }

  function show (scripts, showMap) {
    scripts.mission.reset(scripts, mission => {
      $('#home').hide()
      showMap(mission)
    })
    $('#home').show()
  }
})()
