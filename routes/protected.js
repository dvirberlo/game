const express = require('express')
const router = express.Router()

const protectedController = require('../controllers/protectedController')
/** SHA Controller
 * /sha
 *   /login/:username/:password -> id
 *   /:userId
 *     / -> data
 *     /move/:des -> ?err
 *     /quit -> ?err
 *     /enter/:id -> ?err
 *     /battle/:id -> ?err
 *     /mission -> available mission 
 */

/* GET users listing. */
router.get('/login/:username/:password', protectedController.login)

module.exports = router
