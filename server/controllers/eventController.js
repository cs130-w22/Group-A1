const { isValidObjectId } = require('mongoose');
const { validationResult } = require('express-validator');
const Event = require('../models/event');
const Availability = require('../models/availability');
const { EventInvite } = require('../models/invite');
const Poll = require('../models/poll');
const PollOption = require('../models/pollOption');
const { initializeAvailability } = require('./availabilityController');

exports.createEvent = async (req, res) => {
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

    await initializeAvailability(event);

    res.status(201).send(event._id);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
exports.getEvent = (req, res) => {
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
};

exports.joinEvent = async (req, res) => {
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
};
exports.leaveEvent = async (req, res) => {
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
};
