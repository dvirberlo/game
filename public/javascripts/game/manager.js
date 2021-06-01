'use strict'
/**
 * plan: (UPPERCASE means /javascripts/uppercase.js)
 * (GAME ->)
 * MANAGER ->
 * CLIENT.login -<   MANAGER
 *   err: LOGIN, SIGNUP -> CLIENT.login/signup : -< MANAGER
 *   : MISSION
 */
window.manager = {
  start: (scripts) => {
    console.log(scripts)
  }
}
