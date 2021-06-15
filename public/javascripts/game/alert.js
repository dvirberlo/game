'use strict'

;(function () {
  window.alert = { update }

  function updateResources (resources) {
    alert(JSON.stringify(resources))
    // TODO
  }
})()
