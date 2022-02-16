const User = require('../models/user');

exports.getUser = ((req, res, next) => {
  User.findById(req.params.id, 'username email groups')
    .then((data) => ((data) ? res.json(data) : res.sendStatus(404)))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    }).finally(() => next());
});

exports.getUserByUsername = (req, res, next) => {
  User.findById(req.params.id, 'username email groups')
    .then((data) => ((data) ? res.json(data) : res.sendStatus(404)))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    }).finally(() => next());
};

exports.getUserByEmail = (req, res, next) => {
  User.findOne({ email: req.params.email }, '_id username groups')
    .then((data) => ((data) ? res.json(data) : res.sendStatus(404)))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    }).finally(() => next());
};

exports.getUserGroups = (req, res, next) => {
  User.findOne({ _id: req.params.id }, 'groups')
    .populate('groups')
    .then((data) => res.json(data))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    })
    .finally(() => next());
};

exports.getUserInvites = (req, res, next) => {
  User.findOne({ _id: req.params.id }, 'invites')
    .populate('invites')
    .then((data) => res.json({ data }))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    })
    .finally(() => next());
};
