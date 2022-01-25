const express = require('express')
const router = express.Router();
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Group = require('../models/group')

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
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return next();
            }
            User.create({
                username: req.body.username,
                email: req.body.email,
                password: hash
            }).then((data) => {
                // TODO auth flow
                res.status(201).json({
                    "_id": data._id,
                    "username": data.username
                })
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            }).finally(() => next());
        });
    }
);

module.exports = router;