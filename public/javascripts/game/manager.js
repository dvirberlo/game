'use strict'
/**
 * plan: (UPPERCASE means /javascripts/uppercase.js)
 * LOADER ->
 *   MANAGER ->
 *     NAV, HOME -<
 *   MANAGR ->
 *     PIXI -<
 *   MANAGER ->
 *   ...
 */
;(function () {
  window.manager = { start }

  function start (lib) {
    getData(data => {
      lib.nav.update(data)
      showHome()
    })

    function getData (callback) {
      $.ajax('/protected').done(callback).fail(() => { window.location.href = '/enter' })
    }
    function showHome () {
      lib.home.show(lib, mission => lib.pixi.showMap(lib, mission, showHome))
    }
  }
})()
