const express = require('express')
const router = express.Router()

const protectedController = require('../controllers/protectedController')
/** Protected Controller
 * /protected
 *   /login/:username/:password/:remember -> id
 *   /:username
 *     / -> data
 *     /move/:des -> ?err
 *     /quit -> ?err
 *     /enter/:id -> ?err
 *     /battle/:id -> ?err
 *     /mission -> available mission
 */

/* GET users listing. */
router.get('/login/:username/:password/:remember', protectedController.login)

module.exports = router
