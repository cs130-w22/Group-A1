const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const { body, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const Event = require('../models/event');
const { EventInvite } = require('../models/invite');
const Poll = require('../models/poll');

// should be deleted eventually
router.get('/all', (req, res) => {
  Event.find()
    .then((events) => res.send(events))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

// get all events for user + specify whether I am owner or member
router.get('/', (req, res) => {
  const { userId } = req.session;
  if (userId == null) return res.sendStatus(401);
  Event.find({ owner: userId, members: userId })
    .then((myevents) => {
      const owned = myevents.filter((event) => event.owner == userId);
      const memberTo = myevents.filter((event) => event.owner != userId);
      console.log(myevents);
      res.status(200).json({ owned: owned, memberOnly: memberTo });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

// TODO:
// - Add owner to the document
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
    const { userId } = req.session;
    if (userId == null) return res.sendStatus(401);
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

// join event
router.post(
  '/:id/members',
  async (req, res) => {
    try {
      const { userId } = req.session;
      if (userId == null) return res.sendStatus(401);
      const event = await Event.findById(req.params.id);
      if (!event.members.includes(userId)) {
        // delete any existing invite
        await EventInvite.deleteMany({ recipient: userId, target: event._id });
        event.members.push({ _id: userId });
        await event.save();
        return res.status(200).send(event);
      }
      return res.status(400).send("You're already a member of this event!");
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
);

router.get(
  '/:id/invites',
  (req, res) => {
    EventInvite.find({ target: req.params.id })
      .populate('recipient', '_id username')
      .then((invites) => res.send(invites)).catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  },
);

router.delete('/:id/invites', (req, res) => {
  EventInvite.deleteMany({ target: req.params.id }).then(() => res.sendStatus(204))
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});

// TODO:
// - Only owner of the event can delete event
// - Send 404 if ID is invalid
router.delete(
  '/:id',
  (req, res) => {
    const { id } = req.params;
    const { userId } = req.session;
    if (userId == null) return res.sendStatus(401);
    Event.findById(req.params.id)
      .then((result) => {
        console.log(result);
        if (result.owner != userId) {
          res.status(404).send('You cannot delete an event if you are not the owner');
        } else {
          result.remove();
          res.status(200).send('Deleted the event');
        }
      })
      .catch((err) => console.log(err));
  },
);

module.exports = router;
