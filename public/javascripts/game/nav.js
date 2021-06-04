'use strict'

window.nav = { update }
function update (user) {
  const $details = $('#navDetails')
  for (const res in user.resources) $details.find('#' + res).text(user.resources[res])
  $details.find('#navUsername').text(user.username)
  $details.find('#navXp').text(user.xp)
}
