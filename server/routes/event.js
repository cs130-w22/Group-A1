const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const { body, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const Event = require('../models/event');
const Poll = require('../models/poll');

router.post(
  '/',
  body('name')
    .exists().notEmpty().withMessage('Please enter an event name'),
  (req, res) => {
    const { userId } = req.session;
    if (userId == null) return res.sendStatus(401);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = new Event({
      name: req.body.name,
      description: req.body.description,
      dates: req.body.dates,
      timeEarliest: req.body.timeEarliest,
      timeLatest: req.body.timeLatest,
      archived: false,
      owner: userId,
      members: [userId],
    });
    event.save()
      .then((result) => res.send(result._id))
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  },
);

router.get(
  '/:id',
  (req, res) => {
    if (!ObjectId.isValid(req.params.id)) return res.sendStatus(400);
    Event.findById(req.params.id)
      .populate('owner')
      .populate('members')
      .then((result) => res.send(result))
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  },
);

router.get(
  '/:id/polls',
  (req, res) => {
    Poll.find({
      event: req.params.id,
    })
      .populate('options')
      .then((result) => res.send(result))
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  },
);

router.post(
  '/:id',
  body('name')
    .exists().notEmpty().withMessage('Event name cannot be empty'),
  (req, res) => {
    if (!ObjectId.isValid(req.params.id)) return res.sendStatus(400);
    Event.findById(req.params.id)
      .then((result) => {
        return new Promise((resolve, reject) => {
          if (result.owner === req.session.userId)
            resolve(result.name, result.description);
          else
            reject('Forbidden');
        });
      })
      .then((name, description) => {
        const filter = { _id: req.params.id };
        const update = {
          name,
          description
        };
        return Event.findOneAndUpdate(filter, update);
      })
      .then((result) => res.send(result))
      .catch((err) => {
        console.log(err);
        if(error === 'Forbidden')
          res.sendStatus(403)
        else
          res.sendStatus(500);
      });
  }
);

router.delete(
  '/:id',
  (req, res) => {
    if (!ObjectId.isValid(req.params.id)) return res.sendStatus(400);
    Event.findById(req.params.id)
      .then((result) => {
        return new Promise((resolve, reject) => {
          if (result.owner === req.session.userId)
            resolve();
          else
            reject('Forbidden');
        });
      })
      .then(() => {
        return Event.findByIdAndDelete(req.params.id)
      })
      .then((result) => res.send(result))
      .catch((err) => {
        console.log(err);
        if(error === 'Forbidden')
          res.sendStatus(403)
        else
          res.sendStatus(500);
      });
  }
);

module.exports = router;
