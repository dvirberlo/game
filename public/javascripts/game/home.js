'use strict'

;(function () {
  const MODULE = 'home'

  window[MODULE] = { show }

  function show (lib, showMap) {
    lib.mission.reset(lib, mission => {
      $('#home').hide()
      showMap(mission)
    })
    $('#home').show()
  }
})()
