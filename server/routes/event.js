const { parseISO, set, formatISO } = require('date-fns');
const express = require('express');
const { isValidObjectId } = require('mongoose');

const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  getUserAvailability, getAvailability, getEvent, createEvent,
} = require('../controllers/eventController');
const Availability = require('../models/availability');
const Event = require('../models/event');
const { EventInvite } = require('../models/invite');
const Poll = require('../models/poll');
const PollOption = require('../models/pollOption');

router.post(
  '/',
  body('name').exists().notEmpty().withMessage('Please enter an event name'),
  body('dates').exists().notEmpty().withMessage('Please select at least one date'),
  createEvent,
);

router.get('/:id', getEvent);

router.get('/:id/polls', (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
  Poll.find({
    event: req.params.id,
  })
    .populate('options')
    .then((result) => res.send(result))
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
router.post('/:id/availability/update', async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
  const { userId } = req.session;
  try {
    const { selected, deselected } = req.body;
    const selectedUpdate = await Availability.updateMany(
      {
        event: req.params.id,
        _id: {
          $in: selected,
        },
      },
      { $addToSet: { users: userId } },
    );
    const deselectedUpdate = await Availability.updateMany(
      {
        event: req.params.id,
        _id: {
          $in: deselected,
        },
      },
      { $pull: { users: userId } },
    );
    return res.status(200).send({
      selected: selectedUpdate.nModified,
      deselected: deselectedUpdate.nModified,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// join event
router.post('/:id/join', async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
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
});

router.post('/:id/leave', async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
  try {
    const { userId } = req.session;
    if (userId == null) return res.sendStatus(401);
    const eventUpdate = await Event.updateMany(
      {
        _id: req.params.id,
      },
      {
        $pull: {
          members: userId,
        },
      },
    );
    if (eventUpdate.nModified === 0) { return res.status(400).send("You're not a member of this event!"); }
    await Availability.updateMany(
      {
        event: req.params.id,
      },
      {
        $pull: {
          users: userId,
        },
      },
    );
    const polls = await Poll.find({
      event: req.params.id,
    });
    polls.forEach(async (poll) => {
      await PollOption.updateMany(
        {
          poll: poll._id,
        },
        {
          $pull: {
            voters: userId,
          },
        },
      );
    });

    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

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
