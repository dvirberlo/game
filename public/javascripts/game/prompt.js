'use strict'

;(function () {
  window.prompt = { object }

  function object (object) {
    window.alert(JSON.stringify(object))
    // TODO
  }
})()
