const express = require('express')
const router = express.Router()

const missionController = require('../controllers/missionController')

/* GET mission listing. */
router.get('/', missionController.getMission)

module.exports = router
