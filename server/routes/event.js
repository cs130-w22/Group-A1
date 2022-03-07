/* eslint-disable prefer-promise-reject-errors */
const express = require('express');
const { isValidObjectId } = require('mongoose');

const router = express.Router();
const { body } = require('express-validator');
const {
  getEvents, getEvent, createEvent, joinEvent, leaveEvent,
} = require('../controllers/eventController');
const { getUserAvailability, getAvailability, setAvailability } = require('../controllers/availabilityController');
const { EventInvite } = require('../models/invite');
const Event = require('../models/event');
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

router.post(
  '/',
  body('name').exists().notEmpty().withMessage('Please enter an event name'),
  body('dates').exists().notEmpty().withMessage('Please select at least one date'),
  createEvent,
);

// get all events for user + specify whether I am owner or member
router.get('/', getEvents);

router.get('/:id', getEvent);

async function getPollVotability(poll, userId) {
  return poll.userCanVoteInPoll(userId);
}

router.get('/:id/polls', async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
  Poll.find({
    event: req.params.id,
  })
    .populate('options')
    .then(async (result) => {
      const { userId } = req.session;
      const canVotePromises = [];
      for (let i = 0; i < result.length; i += 1) {
        canVotePromises.push(getPollVotability(result[i], userId));
      }
      const canVotes = await Promise.all(canVotePromises);
      const jsonList = [];
      for (let i = 0; i < result.length; i += 1) {
        jsonList.push({ pData: result[i], canVote: canVotes[i] });
      }
      res.json({ list: jsonList });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

// get event availability
router.get('/:id/availability/', getAvailability);

// get event availability for user
router.get('/:id/availability/:userId', getUserAvailability);

// set availability
router.post('/:id/availability/update', setAvailability);

// update event
router.post(
  '/:id',
  body('name').exists().notEmpty().withMessage('Event name cannot be empty'),
  (req, res) => {
    if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
    Event.findById(req.params.id)
      .then((result) => new Promise((resolve, reject) => {
        // eslint-disable-next-line eqeqeq
        if (result.owner == req.session.userId) resolve([req.body.name, req.body.description]);
        else reject('Forbidden');
      }))
      .then((result) => {
        const [name, description] = result;
        const filter = { _id: req.params.id };
        const update = {
          name,
          description,
        };
        return Event.findOneAndUpdate(filter, update);
      })
      .then((result) => res.send(result))
      .catch((err) => {
        console.log(err);
        if (err === 'Forbidden') res.sendStatus(403);
        else res.sendStatus(500);
      });
  },
);

router.delete('/:id', (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
  Event.findById(req.params.id)
    .then((result) => new Promise((resolve, reject) => {
      // eslint-disable-next-line eqeqeq
      if (result.owner == req.session.userId) resolve();
      else reject('Forbidden');
    }))
    .then(() => Event.findByIdAndDelete(req.params.id))
    .then((result) => res.send(result))
    .catch((err) => {
      console.log(err);
      if (err === 'Forbidden') res.sendStatus(403);
      else res.sendStatus(500);
    });
});

// join event
router.post('/:id/join', joinEvent);

router.post('/:id/leave', leaveEvent);

router.get('/:id/invites', (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
  EventInvite.find({ target: req.params.id })
    .populate('recipient', '_id username')
    .then((invites) => res.send(invites))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

router.delete('/:id/invites', (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
  EventInvite.deleteMany({ target: req.params.id })
    .then(() => res.sendStatus(204))
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const { userId } = req.session;
  if (userId == null) return res.sendStatus(401);
  Event.findById(req.params.id)
    .then((result) => {
      if (result.owner != userId) {
        res
          .status(404)
          .send('You cannot delete an event if you are not the owner');
      } else {
        result.remove();
        res.status(200).send('Deleted the event');
      }
    })
    .catch((err) => console.log(err));
});

router.post('/:id/archive', (req, res) => {
  const { id } = req.params;
  const { userId } = req.session;
  if (userId == null) return res.sendStatus(401);
  Event.findById(id)
    .then((result) => {
      // eslint-disable-next-line eqeqeq
      if (result.owner != userId) {
        res
          .status(404)
          .send('You cannot archive an event if you are not the owner');
      } else {
        const filter = { _id: id };
        const update = { archived: true };
        return Event.findOneAndUpdate(filter, update);
      }
    })
    .then(() => {
      res.status(200).send('Archived the event');
    })
    .catch((err) => console.log(err));
});

router.post('/:id/unarchive', (req, res) => {
  const { id } = req.params;
  const { userId } = req.session;
  if (userId == null) return res.sendStatus(401);
  Event.findById(id)
    .then((result) => {
      // eslint-disable-next-line eqeqeq
      if (result.owner != userId) {
        res
          .status(404)
          .send('You cannot unarchive an event if you are not the owner');
      } else {
        const filter = { _id: id };
        const update = { archived: false };
        return Event.findOneAndUpdate(filter, update);
      }
    })
    .then(() => {
      res.status(200).send('Unarchived the event');
    })
    .catch((err) => console.log(err));
});

module.exports = router;
