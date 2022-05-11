/**
 * Router Handler(Login)
 *
 */
'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/loginController')


router.get('/', controller.login)
router.post('/', controller.auth)

module.exports = router
