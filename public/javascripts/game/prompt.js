'use strict'

;(function () {
  const MODULE = 'prompt'

  window[MODULE] = { object }

  function object (object) {
    window.alert(JSON.stringify(object))
    // TODO
  }
})()
