/**
 * Mongoose model for a user.
 *
 * @author Oyejobi Ibrahim Olamide
 * @version 1.0.0
 */

'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

/**
 * create s new instance of mongoose Schema
 */
const userForm = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username cannot be blank.'],
      unique: true,
      trim: true
    },
      password: {
        type: String,
        required: [true, 'Password cannot be blank.'],
      }
    },
  {
    timestamps: true
  }
)




/**
 * Authentication Handler for User in database
 *
 * @param {String} username Username.
 * @param {String} password Password.
 * @return {Promise<*>} Promise.
 */
userForm.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid login attempt.')
  }
  return user
}

/**
 * fire a function before the form saved to mongodb
 */
userForm.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})



const User = mongoose.model('User', userForm)


module.exports = User
