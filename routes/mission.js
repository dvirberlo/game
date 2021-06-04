const express = require('express')
const router = express.Router()

const missionController = require('../controllers/missionController')

/** Mission Router { /protected }
 * /mission -> available mission
 *   /enter/:id -> mission.populate('map')
 *   /quit -> ?err
 *   /move/:currentCell -> ?err
 */
/* GET mission listing. */
router.get('/', missionController.getMission)
router.get('/enter/:missionId', missionController.enter)
router.get('/quit', missionController.quit)
router.get('/move/:currentCell', missionController.move)

module.exports = router
