/**
 *  Router Handler(Register)
 *
 */

'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/loginController')

router.get('/', controller.register)
router.post('/create', controller.create)

module.exports = router
