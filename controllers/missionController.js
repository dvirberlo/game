const createError = require('http-errors')

const User = require('../models/user')
const Mission = require('../models/mission')

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
    user.currentMission = { mission: missionId, progress: { currentCell: 0, emptyCells: [0] } }
    user.save(error => {
      if (error) return next(createError(error))
      Mission.findById(missionId).exec((error, mission) => {
        if (error) return next(createError(error))
        res.json({ ...user.currentMission, mission })
      })
    })
  })
}
exports.quit = (req, res, next) => {
  User.findById(req.UserId, { mission: 1 }, (error, user) => {
    if (error) return next(createError(error))
    user.currentMission = null
    user.save(error => {
      if (error) return next(createError(error))
      res.json(null)
    })
  })
}
exports.move = (req, res, next) => {
  const currentCell = req.params.currentCell
  User.findById(req.UserId, { currentMission: 1 }).populate('currentMission.mission').exec((error, user) => {
    if (error) return next(createError(error))
    if (!user.currentMission || !user.currentMission.mission || !user.currentMission.progress) return next(createError.Forbidden('No mission found'))
    user.currentMission.progress.currentCell = currentCell
    if (!user.currentMission.progress.emptyCells.includes(currentCell)) user.currentMission.progress.emptyCells.push(currentCell)
    user.save(error => {
      if (error) return next(createError(error))
      res.json(user.currentMission)
    })
  })
}
