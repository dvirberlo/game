const express = require('express')
const router = express.Router()

const missionRouter = require('./mission')

const protectedController = require('../controllers/protectedController')

/** Protected Router
 * /protected (authCheck)
 *   / -> data
 *   /mission (missionRouter)
 */
/* GET protected listing. */
router.use(protectedController.authCheck)

router.use('/mission', missionRouter)

router.get('/', protectedController.getData)

module.exports = router
