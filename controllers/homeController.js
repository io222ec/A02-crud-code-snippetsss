'use strict'

const homeController = {}

/**
 * Home Router  Render.
 *
 * @param {*} req 
 * @param {*} res 
 */
homeController.index = (req, res) => {
  res.render('home/index')
}

module.exports = homeController
