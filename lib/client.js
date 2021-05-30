exports.send = function (res, data = null, status = null) {
  if (status) res.status(status)
  return res.json(data)
}
