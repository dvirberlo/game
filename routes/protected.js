const express = require('express')
const router = express.Router()

const protectedController = require('../controllers/protectedController')

/* GET protected listing. */
router.use(protectedController.authCheck)

module.exports = router
