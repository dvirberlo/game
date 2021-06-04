const Mission = require('../models/mission')
const User = require('../models/user')
require('../models/map')
const createError = require('http-errors')

/** Mission Controller
 * /mission -> available mission
 *   /enter/:id -> ?err
 *   /quit -> ?err
 *   /move/:currentCell -> ?err
 */
function getLevel (xp) {
  return Math.round(xp / 100) + 1
}
exports.details = (req, res, next) => {
  User.findById(req.UserId, { xp: 1 }, (err, user) => {
    if (err) return next(createError(err))
    Mission.findOne({ level: getLevel(user.xp) }, { __v: 0 }, (err, doc) => {
      if (err) return next(createError(err))
      res.json(doc)
    })
  })
}
exports.enter = (req, res, next) => {
  const missionId = req.params.missionId
  User.findById(req.UserId, { mission: 1 }, (err, user) => {
    if (err) return next(createError(err))
    user.mission = { missionId, progress: { currentCell: 0, emptyCells: [0] } }
    user.save(err => {
      if (err) return next(createError(err))
      Mission.findById(missionId).populate('map').exec((err, doc) => {
        if (err) return next(createError(err))
        res.json(doc)
      })
    })
  })
}
exports.quit = (req, res, next) => {
  User.findById(req.UserId, { mission: 1 }, (err, doc) => {
    if (err) return next(createError(err))
    doc.mission = null
    doc.save(err => {
      if (err) return next(createError(err))
      res.json(null)
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
      res.json(null)
    })
  })
}
