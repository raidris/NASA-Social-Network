const express = require('express')

// load the controller
const controller = require('../controllers/register')

const router = express.Router()

// /register/add-details => GET
router.get('/add-details', controller.getRegisterDetails)

// /register/add-password => POST
router.post('/add-password', controller.postRegisterDetails)

// /register/add-password => GET
router.get('/add-password', controller.getRegisterPassword)

// /register/ => POST
router.post('/', controller.postRegisterPassword)

module.exports = router
