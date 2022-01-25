const User = require('../models/user');

exports.getUser = function(req, res, next) {
    User.findById(req.params.id, 'username email groups')
        .then((data) => (data) ? res.json(data) : res.sendStatus(404))
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        }).finally(() => next());
}

exports.getUserByUsername = function(req, res, next) {
    User.findById(req.params.id, 'username email groups')
        .then((data) => (data) ? res.json(data) : res.sendStatus(404))
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        }).finally(() => next());
}

exports.getUserByEmail = function (req, res, next) {
    User.findOne({'email': req.params.email}, '_id username groups')
        .then((data) => (data) ? res.json(data) : res.sendStatus(404))
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        }).finally(() => next());
}

exports.getUserGroups = function (req, res, next) {
    User.findOne({'_id': req.params.id}, 'groups')
        .populate("groups")
        .then((data) => res.json(data))
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        }).finally(() => next());
}

exports.getUser
