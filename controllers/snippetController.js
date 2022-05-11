/**
 * @author Oyejobi Ibrahim Olamide
 * @version 1.0.0
 */

'use strict'

const Snippet = require('../models/Snippet')
const moment = require('moment')

const snippetController = {}

/**
 * home page snippet.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
snippetController.index = async (req, res, next) => {
  try {
    const data = {
      snippets: (await Snippet.find({})).map((snippet) => ({
        id: snippet._id,
        user: snippet.username,
        snippet: snippet.snippet,
        createdAt: moment(snippet.createdAt).format('YY-MM-DD HH:mm'),
        updatedAt: moment(snippet.updatedAt).format('YY-MM-DD HH:mm')
      }))
    }
    data.snippets.reverse()
    res.render('snippets/index', { viewData: data })
  } catch (err) {
    err.statusCode = 500
    return next(err)
  }
}

/**
 * New snippet.
 *
 * @param {*} req
 * @param {*} res
 */
snippetController.new = async (req, res) => {
  res.render('snippets/new', {})
}

/**
 *  Create Snippet.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
snippetController.create = async (req, res, next) => {
  if (req.body.snippet.trim().length) {
    try {
      const snippet = new Snippet({
        username: req.session.userName,
        snippet: req.body.snippet
      })
      await snippet.save()
      req.session.flash = {
        type: 'success',
        text: 'Snippet successfully saved.'
      }
      res.redirect('.')
    } catch (err) {
      err.statusCode = 500
      return next(err)
    }
  } else {
    req.session.flash = {
      type: 'danger',
      text: 'Obs .. Snippet Code must be One character or more.'
    }
    res.redirect('.')
  }
}

/**
 *  DB Snippets Update.
 *
 * @param {*} req Request.
 * @param {*} res Response.
 * @param {*} next Next.
 */
snippetController.update = async (req, res, next) => {
  if (req.body.snippet.trim().length) {
    try {
      const result = await Snippet.updateOne(
        { _id: req.params.id },
        {
          snippet: req.body.snippet
        }
      )
      if (result.nModified === 1) {
        req.session.flash = {
          type: 'success',
          text: 'The code snippet was updated successfully.'
        }
      } else {
        req.session.flash = {
          type: 'danger',
          text: 'Unable to update code snippet.'
        }
      }
      res.redirect('..')
    } catch (err) {
      err.statusCode = 500
      return next(err)
    }
  } else {
    req.session.flash = {
      type: 'danger',
      text: 'Obs .. Snippet Code must be One character or more.'
    }
    res.redirect('./edit')
  }
}

/**
 *  Snippets Deletion.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
snippetController.remove = async (req, res, next) => {
  try {
    const snippet = await Snippet.findOne({ _id: req.params.id })
    const viewData = {
      id: snippet._id,
      snippet: snippet.snippet
    }
    res.render('snippets/remove', { viewData })
  } catch (err) {
    err.statusCode = 500
    return next(err)
  }
}



snippetController.delete = async (req, res, next) => {
  try {
    await Snippet.deleteOne({ _id: req.params.id })
    req.session.flash = {
      type: 'success',
      text: 'The code snippet was deleted successfully.'
    }
    res.redirect('..')
  } catch (err) {
    err.statusCode = 500
    return next(err)
  }
}

/**
 * Snippet editing.
 *
 * @param {*} req Request.
 * @param {*} res Response.
 * @param {*} next Next.
 */
snippetController.edit = async (req, res, next) => {
  try {
    const snippet = await Snippet.findOne({ _id: req.params.id })
    const data = {
      id: snippet._id,
      user: snippet.username,
      snippet: snippet.snippet,
      createdAt: moment(snippet.createdAt).format('YY-MM-DD'),
      updatedAt: moment(snippet.updatedAt).format('YY-MM-DD')
    }
    res.render('snippets/edit', { viewData: data })
  } catch (err) {
    err.statusCode = 500
    return next(err)
  }
}

/**
 * Authorization.
 *
 * @param {*} req Request.
 * @param {*} res Response.
 * @param {*} next Next.
 */
snippetController.authorize = async (req, res, next) => {
  if (!req.params.id && req.session.userName) {
    return next()
  }

  const userName = async function () {
    const user = await Snippet.findOne({ _id: req.params.id })
    return user.username
  }
  if (!req.session.userName || req.session.userName !== (await userName())) {
    const err = new Error('403: Forbidden')
    err.statusCode = 403
    return next(err)
  }
  next()
}

module.exports = snippetController
