'use strict'

;(function () {
  const MODULE = 'nav'

  window[MODULE] = { update }

  function update (user) {
    const $details = $('#navDetails')
    if (user.resources) for (const res in user.resources) $details.find('#' + res).text(user.resources[res])
    if (user.username) $details.find('#navUsername').text(user.username)
    if (user.xp) $details.find('#navXp').text(user.xp)
  }
})()
