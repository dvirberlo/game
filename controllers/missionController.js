const createError = require('http-errors')

const User = require('../models/user')
const Mission = require('../models/mission')
require('../models/map')

function getLevel (xp) {
  return Math.round(xp / 100) + 1
}
exports.getMission = (req, res, next) => {
  User.findById(req.UserId, { xp: 1 }, (error, user) => {
    if (error) return next(createError(error))
    Mission.findOne({ level: getLevel(user.xp) }, { __v: 0 }, (error, mission) => {
      if (error) return next(createError(error))
      res.json(mission)
    })
  })
}
exports.enter = (req, res, next) => {
  const missionId = req.params.missionId
  User.findById(req.UserId, { mission: 1 }, (error, user) => {
    if (error) return next(createError(error))
    user.mission = { missionId, progress: { currentCell: 0, emptyCells: [0] } }
    user.save(error => {
      if (error) return next(createError(error))
      Mission.findById(missionId).populate('map').exec((error, mission) => {
        if (error) return next(createError(error))
        res.json(mission)
      })
    })
  })
}
exports.quit = (req, res, next) => {
  User.findById(req.UserId, { mission: 1 }, (error, user) => {
    if (error) return next(createError(error))
    user.mission = null
    user.save(error => {
      if (error) return next(createError(error))
      res.json(null)
    })
  })
}
exports.move = (req, res, next) => {
  const currentCell = req.params.currentCell
  User.findById(req.UserId, { mission: 1 }, (error, user) => {
    if (error) return next(createError(error))
    if (!user.mission || !user.mission.missionId || !user.mission.progress) return next(createError.Forbidden('No mission found'))
    user.mission.progress.currentCell = currentCell
    if (!user.mission.progress.emptyCells.includes(currentCell)) user.mission.progress.emptyCells.push(currentCell)
    user.save(error => {
      if (error) return next(createError(error))
      res.json(null)
    })
  })
}
