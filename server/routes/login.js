const express = require('express')
const router = express.Router();
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcrypt");
const { generateTokens } = require('../helpers/tokens')

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
            if (user == null) return res.status(401).statusMessage("No user found for submitted email");
            let hash = user.password;
            bcrypt.compare(req.body.password, hash, function(err, result) {
                if (err) return res.sendStatus(500);
                if (!result) return res.sendStatus(401);
                // generate jwt tokens
                let token = generateTokens(user)
                res.status(200).json({
                    "_id": user._id,
                    "username": user.username,
                    "access_token": token
                    // "refresh_token": tokens.refresh_token
                })
            });
        });
    }
);
module.exports = router;