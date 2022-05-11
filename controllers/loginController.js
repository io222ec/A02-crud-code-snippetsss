/**
 * Controller for the Homepage.
 *
 * @author Oyejobi Ibrahim Olamide
 * @version 1.0.0
 */

'use strict'




const User = require('../models/mongoose')
const loginController = {}


/**
 * login Router.
 *
 * @param {*} req Request object.
 * @param {*} res Response object.
 */
loginController.login = (req, res) => {
res.render('login/index')
}

/**
 * Authentication.
 *
 * @param {*} req
 * @param {*} res
 */
loginController.auth = async (req, res) => {
  try {
    const user = await User.authenticate(req.body.username, req.body.password)
    req.session.regenerate(() => {
      req.session.userName = user.username
      req.session.flash = { type: 'success', text: 'Successfully logged in.' }
     res.redirect('..')
    })
  } catch (err) {
    req.session.flash = { type: 'danger', text: err.message }
    res.redirect('.')
  }
}

/**
 *Handling logout.
 *
 * @param {*} req
 * @param {*} res
 */
loginController.logout = (req, res) => {
  try {
    req.session.destroy()
    res.redirect('../')
  } catch (err) {
    req.session.flash = {
      type: 'fail',
      text: 'Failed to logout!'
    }
    res.redirect('../')
  }
}

/**
 * new user registration.
 *
 * @param {*} req Request.
 * @param {*} res Response.
 */
loginController.register = (req, res) => {
  res.render('register/index')
}

/**
 * new user handling.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 */
loginController.create = async (req, res, next) => {
  if (
    req.body.username.length > 2 &&
    req.body.password1.length > 4 &&
    req.body.password1 === req.body.password2
  ) {
    try {
      const user = new User({
        username: req.body.username,
        password: req.body.password1
      })
      await user.save()
      req.session.flash = {
        type: 'success',
        text: 'Successfully created, please login.'
      }
      res.redirect('../login')
    } catch (err) {
      err.statusCode = 500
      return next(err)
    }
  }
  else if (req.body.username.length < 2) {
    req.session.flash = {
      type: 'danger',
      text: 'UserName must be at least 3 characters.'
    }
    res.redirect('.')
  } else if (req.body.password1 !== req.body.password2) {
    req.session.flash = { type: 'danger', text: "Passwords don't match." }
    res.redirect('.')
  } else if (req.body.password1.length < 5) {
  req.session.flash = {
     type: 'danger',
     text: 'Password must be at least 5 characters.'
   }
    res.redirect('.')
  } else {
    req.session.flash = {
      type: 'danger',
      text: 'Something went wrong, please try again.'
    }
    res.redirect('.')
  }
}

module.exports = loginController
