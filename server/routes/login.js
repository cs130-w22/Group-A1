/** Express router providing login related routes
 * @module routers/login
 * @requires express
 */

const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

/**
 * User Login
 * @name POST/login
 * @function
 * @memberof module:routers/login
 * @inner
 * @param {express.Request} body Request body
 * @param {string} body.email Email
 * @param {string} body.password Password
 * @return {express.Response} User Session
 */
router.post(
  '/',
  body('email')
    .exists().withMessage('Email cannot be empty')
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email'),
  body('password')
    .exists().withMessage('Password cannot be empty'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) return res.sendStatus(500);
      if (user == null) {
        return res.status(401).send({ field: 'email', msg: 'No user exists for entered email' });
      }
      // verify hashed password
      const hash = user.password;
      bcrypt.compare(req.body.password, hash, (bcryptErr, result) => {
        if (bcryptErr) return res.sendStatus(500);
        if (!result) return res.status(401).send({ field: 'password', msg: 'Incorrect email/password' });
        // generate session
        req.session.userId = user._id;
        req.session.save();
        return res.status(200).json({
          userId: user._id,
          username: user.username,
        });
      });
    });
  },
);
module.exports = router;
