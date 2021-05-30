const express = require('express')
const router = express.Router()

const protectedController = require('../controllers/protectedController')
/** Protected Controller
 * /protected .use(authCheck)
 *   /:username
 *     / -> data
 *     /move/:des -> ?err
 *     /quit -> ?err
 *     /enter/:id -> ?err
 *     /battle/:id -> ?err
 *     /mission -> available mission
 */

/* GET users listing. */
router.use(protectedController.authCheck)

module.exports = router
