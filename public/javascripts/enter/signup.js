'use strict'

;(function () {
  const $username = $('#username')
  const $status = $('#usernameStatus')

  $username.bind('input', () => getStatus($username.val()))

  function getStatus (username) {
    setStatus('warning', 'arrow-repeat', username, 'checking availability...')
    $.ajax({ url: './username', data: { username } }).done(res => {
      if (username !== $username.val()) return false
      if (res === false) return setStatus('danger', 'emoji-frown', username, 'is unavailabe.')
      setStatus('success', 'emoji-smile', username, 'is availabe!')
    })
  }
  function setStatus (color, icon, username, message) {
    for (const ele of $status.children()) $(ele).removeClass()
    $status.removeClass()
    $status.addClass(['form-text', 'text-' + color])
    $status.children('#icon').addClass(['bi', 'bi-' + icon])
    $status.children('#name').text(username)
    $status.children('#message').text(' - ' + message)
  }
})()
