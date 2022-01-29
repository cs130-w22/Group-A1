const express = require('express')
const router = express.Router();
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Group = require('../models/group')
const { generateTokens } = require('../helpers/tokens')

// sign up
router.post('/', 
    body('username')
        .exists().withMessage('Username cannot be empty')
        .isAlphanumeric().withMessage('Username must be alphanumeric')
        .custom(value => {
            return User.findOne({ username: value })
                .then(user => { if (user) return Promise.reject('Username already in use'); })
        }),
    body('email')
        .exists().withMessage('Email cannot be empty')
        .normalizeEmail().isEmail().withMessage('Email must be a valid email address')
        .custom(value => {
            return User.findOne({ email: value })
                .then(user => { if (user) return Promise.reject('Email already in use'); })
        }),
    body('password')
        .exists().withMessage('Password cannot be empty'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            User.create({
                username: req.body.username,
                email: req.body.email,
                password: hash
            }).then((user) => {
                // generate jwt tokens
                let token = generateTokens(user)
                return res.status(201).json({
                    "_id": user._id,
                    "username": user.username,
                    "access_token": token
                    // "refresh_token": tokens.refreshtoken
                })
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            })
        });
    }
);

module.exports = router;