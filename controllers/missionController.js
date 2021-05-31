const Mission = require('../models/mission')
const User = require('../models/user')
const createError = require('http-errors')
// const client = require('../lib/client')

/** Mission Controller
 * /mission -> available mission
 *   /enter/:id -> ?err
 *   /quit -> ?err
 *   /move/:des -> ?err
 *   /battle/:id -> ?err
 */
// req.UserId
exports.getMission = (req, res, next) => {
  User.findById(req.UserId, { level: 1 }, (err, doc) => {
    if (err) return next(createError(err))
    Mission.findOne({ level: doc.level }, (err, doc) => {
      if (err) return next(createError(err))
    })
  })
}
