const express = require('express')

// load the controller
const controller = require('../controllers/login')

const router = express.Router()

// / => GET
router.get('/', controller.getLogin)

// / => POST
router.post('/', controller.postLogout)

module.exports = router


