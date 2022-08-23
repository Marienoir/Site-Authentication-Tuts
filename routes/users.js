const express = require('express');
const router = express.Router()
const Joi = require('joi')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
//validation schema

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
  confirmationPassword: Joi.any().valid(Joi.ref('password')).required()
})

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required()
})

router.route('/register')
  .get((req, res) => {
    res.render('register')
  })
  .post(async (req, res, next) => {
    try {
      const result = userSchema.validate(req.body)
      if (result.error) {
        req.flash('error', 'Data entered is not valid. Please try again.')
        res.redirect('/users/register')
        return
      }

      const user = await User.findOne({ 'email': result.value.email })
      if (user) {
        req.flash('error', 'Email is already in use.')
        res.redirect('/users/register')
        return
      }

      const hash = await User.hashPassword(result.value.password)
      delete result.value.confirmationPassword
      result.value.password = hash

      const newUser = await new User(result.value)
      await newUser.save()
      
      req.flash('success', 'Registration successfully, go ahead and login.')
      res.redirect('/users/login')
    } catch (error) {
      next(error)
    }
  })

router.route('/login')
  .get((req, res) => {
    console.log(req.isAuthenticated());
    res.render('login')
  })
  .post(async (req, res, next) => {
  try {
    const result = loginSchema.validate(req.body)
    if (result.error) {
      req.flash('error', 'Data entered is not valid. Please try again.')
      res.redirect('/users/login')
      return
    }

    const user = await User.findOne({ 'email': result.value.email })
    if (user) {
      let passwordIsValid = bcrypt.compareSync(
        result.value.password,
        user.password
      );
      if (!passwordIsValid) {
        req.flash('error', 'Email/Password is not valid. Please try again.')
        res.redirect('/users/login')
        return
      }
      req.flash('success', 'Login successfully')
      res.redirect('/users/dashboard')
    }
  } catch (error) {
    next(error)
  }
})
module.exports = router