exports.send = function (res, data = null, status = null) {
  if (status) res.status(status)
  return res.json(data)
}
exports.error = function (res, err, status = null, debug = false) {
  if (status) res.status(status)
  if (err && debug) console.error(err)
  if (err) return exports.send(res, { error: err })
  return exports.send(res)
}
exports.multiError = function (res, err, status, secondErr, secondStatus = null) {
  if (err) exports.error(res, err, status, true)
  else exports.error(res, secondErr, secondStatus)
}
