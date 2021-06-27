'use strict'

;(function () {
  window.prompt = { updateResources }

  function updateResources (resources) {
    window.alert(JSON.stringify(resources))
    // TODO
  }
})()
