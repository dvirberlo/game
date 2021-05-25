const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

/* GET users listing. */
router.get('/username/:username', userController.username)
router.get('/signup/:username/:password', userController.signup)

module.exports = router
