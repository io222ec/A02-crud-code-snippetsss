/**
 *  Router Handler(Logout)
 *
 */
'use strict'

const express = require('express')
const router = express.Router()
const controller = require('../controllers/loginController')

router.get('/', controller.logout)

module.exports = router
