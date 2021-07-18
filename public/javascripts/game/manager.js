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
  const MODULE = 'manager'

  let userData

  window[MODULE] = { start, getUserData, setData }

  function start (lib) {
    updateData(data => {
      lib.nav.update(data)
      showHome()
    })
    function showHome () {
      lib.home.show(lib, mission => lib.pixi.showMap(mission, showHome))
    }
  }
  function updateData (callback) {
    $.ajax('/protected').done(data => {
      setData(data)
      callback(data)
    }).fail(() => { window.location.href = '/enter' })
  }

  function setData (data) {
    userData = data
  }

  function getUserData (forceUpdate, callback) {
    if (forceUpdate) updateData(callback)
    else return userData
  }
})()
