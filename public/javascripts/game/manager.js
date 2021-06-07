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
// ;(function () {
window.manager = { start }

function start (scripts) {
  getData(data => {
    scripts.nav.update(data)
    showHome()
  })

  function getData (callback) {
    $.ajax('/protected').done(callback).fail(() => { window.location.href = '/enter' })
  }
  function showHome () {
    scripts.home.show(scripts, mission => scripts.pixi.showMap(scripts, mission, showHome))
  }
}
// })()
