const { parseISO, set, formatISO } = require('date-fns');
const express = require('express');

const router = express.Router();
const { body, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const { isValidObjectId } = require('mongoose');
const Availability = require('../models/availability');
const Event = require('../models/event');
const { EventInvite } = require('../models/invite');
const Poll = require('../models/poll');

router.post(
  '/',
  body('name').exists().notEmpty().withMessage('Please enter an event name'),
  body('dates').exists().notEmpty().withMessage('Please select at least one date'),
  async (req, res) => {
    try {
      const { userId } = req.session;
      if (userId == null) return res.sendStatus(401);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let timeEarliest = 0;
      let timeLatest = 23;
      if (req.body.timeEarliest !== -1) timeEarliest = req.body.timeEarliest;
      if (req.body.timeLatest !== -1) timeLatest = req.body.timeLatest;
      const event = new Event({
        name: req.body.name,
        description: req.body.description,
        dates: req.body.dates,
        timeEarliest,
        timeLatest,
        archived: false,
        owner: userId,
        members: [userId],
      });

      req.body.dates.forEach((date) => {
        const d = date;
        for (let i = timeEarliest; i <= timeLatest; i += 1) {
          const datetime = set(d, { hours: i });
          const availability = new Availability({ event: event._id, time: datetime });
          availability.save();
          event.blocks.push(availability);
        }
      });
      await event.save();
      res.send(event._id);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
);

router.get('/:id', (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
  Event.findById(req.params.id)
    .populate('owner')
    .populate('members')
    .then((result) => {
      if (result === null) return res.sendStatus(404);
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

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
router.get('/:id/availability/', (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
  Availability.find({
    event: req.params.id,
  })
    .then((result) => {
      if (result == null) res.sendStatus(404);
      else res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

// get event availability for user
router.get('/:id/availability/:userId', async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
  if (!isValidObjectId(req.params.userId)) return res.sendStatus(400);
  try {
    const avail = await Availability.find({
      event: req.params.id,
      users: req.session.userId,
    }, 'time');
    return res.send(avail);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/:id/availability/', async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
  const { userId } = req.session;
  try {
    const { selected, deselected } = req.body;
    await Availability.updateMany(
      {
        event: req.params.id,
        _id: {
          $in: selected,
        },
      },
      { $push: { users: userId } },
    );
    await Availability.updateMany(
      {
        event: req.params.id,
        _id: {
          $in: deselected,
        },
      },
      { $pull: { users: userId } },
    );
    return res.sendStatus(200);
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
    const event = await Event.findById(req.params.id);
    if (event.members.includes(userId)) {
      event.members.pull({ _id: userId });
      await event.save();
      return res.status(200).send(event);
    }
    return res.status(400).send("You're not a member of this event!");
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
