exports.error = function (res, err, status, debug = false) {
  if (status) res.status(status)
  if (err && debug) console.error(err)
  if (err) res.json({ error: err.message })
  else res.send(null)
}
