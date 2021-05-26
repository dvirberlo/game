exports.error = function (res, err, status = null, debug = false) {
  if (status) res.status(status)
  if (err && debug) console.error(err)
  if (err) return res.json({ error: err.message })
  return res.json(null)
}
exports.send = function (res, data = null, status = null) {
  if (status) res.status(status)
  return res.json(data)
}
