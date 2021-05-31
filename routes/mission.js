const express = require('express')
const router = express.Router()

const missionController = require('../controllers/missionController')

/* GET mission listing. */
router.get('/', missionController.details)
router.get('/enter/:missionId', missionController.enter)
router.get('/quit', missionController.quit)
router.get('/move/:currentCell', missionController.move)

module.exports = router
