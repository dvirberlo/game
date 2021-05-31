const Mission = require('../models/mission')
const User = require('../models/user')
const createError = require('http-errors')
const client = require('../lib/client')

/** Mission Controller
 * /mission -> available mission
 *   /enter/:id -> ?err
 *   /quit -> ?err
 *   /move/:currentCell -> ?err
 */
// req.UserId
exports.details = (req, res, next) => {
  User.findById(req.UserId, { xp: 1 }, (err, user) => {
    if (err) return next(createError(err))
    Mission.findOne({ level: Math.round(user.xp / 100) }, { __v: 0 }, (err, doc) => {
      if (err) return next(createError(err))
      client.send(res, doc)
    })
  })
}
exports.enter = (req, res, next) => {
  const missionId = req.params.missionId
  User.findById(req.UserId, { mission: 1 }, (err, doc) => {
    if (err) return next(createError(err))
    doc.mission = { missionId, progress: { currentCell: 0, emptyCells: [0] } }
    doc.save(err => {
      if (err) return next(createError(err))
      client.send(res)
    })
  })
}
exports.quit = (req, res, next) => {
  User.findById(req.UserId, { mission: 1 }, (err, doc) => {
    if (err) return next(createError(err))
    doc.mission = null
    doc.save(err => {
      if (err) return next(createError(err))
      client.send(res)
    })
  })
}
exports.move = (req, res, next) => {
  const currentCell = req.params.currentCell
  User.findById(req.UserId, { mission: 1 }, (err, doc) => {
    if (err) return next(createError(err))
    if (!doc.mission || !doc.mission.missionId || !doc.mission.progress) return next(createError.Forbidden('No mission found'))
    doc.mission.progress.currentCell = currentCell
    if (!doc.mission.progress.emptyCells.includes(currentCell)) doc.mission.progress.emptyCells.push(currentCell)
    doc.save(err => {
      if (err) return next(createError(err))
      client.send(res)
    })
  })
}
