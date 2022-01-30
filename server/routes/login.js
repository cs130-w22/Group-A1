const express = require('express')
const router = express.Router();
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

router.post('/', 
    body('email')
        .exists().withMessage('Email cannot be empty')
        .normalizeEmail()
        .isEmail().withMessage('Invalid email'),
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
                return res.status(401).send('No user exists for entered email');
            }
            // verify hashed password
            let hash = user.password;
            bcrypt.compare(req.body.password, hash, function(err, result) {
                if (err) return res.sendStatus(500);
                if (!result) return res.sendStatus(401);
                // generate session
                req.session.userId = user._id;
                req.session.save();
                // res.cookie('user', sessionUser,
                // {
                //     maxAge: 24*60*60,
                //     httpOnly: false,
                // }).status(200);
                res.status(200).json({
                    "userId": user._id,
                    "username": user.username
                });
            });
        });
    }
);
module.exports = router;