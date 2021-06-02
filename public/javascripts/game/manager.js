'use strict'
/**
 * plan: (UPPERCASE means /javascripts/uppercase.js)
 * LOADER ->
 *   MANAGER ->
 *     HOME -<
 *   MANAGR ->
 *     PIXI -<
 *   MANAGER ->
 *   ...
 */
// ;(function () {
window.manager = { start }
function start (scripts) {
  getData(res => {
    scripts.nav.update(res)
    showHome(scripts)
  })

  function getData (callback) {
    $.ajax('/protected').done(callback).fail(() => { window.location.href = '/enter' })
  }
  function showHome (scripts) {
    scripts.home.show(scripts, mission => scripts.mission.show(scripts, showHome))
  }
}
// })()
