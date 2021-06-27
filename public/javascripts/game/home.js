'use strict'

;(function () {
  window.home = { show }

  function show (lib, showMap) {
    lib.mission.reset(lib, mission => {
      $('#home').hide()
      showMap(mission)
    })
    $('#home').show()
  }
})()
