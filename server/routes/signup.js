const express = require('express')
const router = express.Router();
const User = require('../models/user');
const bcrypt = require("bcrypt");

// sign up
router.post('/', (req, res, next) => {
    if (!req.is('application/x-www-form-urlencoded')) return res.sendStatus(400);
    if (req.body == null) return res.sendStatus(401);

    const username = req.body.username;
    const password = req.body.password;

    // check if user/pass provided
    if (username == null || password == null) return res.sendStatus(401);

    bcrypt.hash(password, 10, (err, hash) => {
        User.create({
            username: username,
            password: hash
        })
        .then((data) => {
            // TODO auth flow
            return res.status(201).json({"_id": data._id})
        })
        .catch((err) => {
            console.log(err);
            return res.sendStatus(500);
        });
    });
    
  });

  module.exports = router;