const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const { body, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const Event = require('../models/event');
const Poll = require('../models/poll');

// TODO:
// - Add owner to the document
router.post(
  '/',
  body('name')
    .exists().notEmpty().withMessage('Please enter an event name'),
  (req, res) => {
    const { userId } = req.session;
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

// TODO:
// - Only members of the event can view page
// - Send 404 if ID is invalid
router.get(
  '/:id',
  (req, res) => {
    if (!ObjectId.isValid(req.params.id)) return res.sendStatus(401);
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

// TODO:
// - Only owner of the event can delete event
// - Send 404 if ID is invalid
// router.delete(
//   '/:id',
//   (req, res) => {
//     const id = req.params.id;
//     Event.findByIdAndDelete(id)
//       .then(result => console.log(result))
//       .catch(err => console.log(err));
//   }
// );

module.exports = router;
