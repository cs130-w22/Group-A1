const express = require('express')
const router = express.Router();
const User = require('../models/user');

router.get('/users/:id', (req, res, next) => {
    User.find({'_id': req.params.id}, 'username groups')
        .then((data) => res.json(data))
        .catch(next)
});

module.exports = router;