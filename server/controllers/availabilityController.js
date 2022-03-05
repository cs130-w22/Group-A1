const { ObjectId } = require('mongodb');
const { isValidObjectId } = require('mongoose');
const { set } = require('date-fns');
const Event = require('../models/event');
const Availability = require('../models/availability');

exports.initializeAvailability = async (event) => {
  let earliest = event.timeEarliest || 0;
  let latest = event.timeLatest || 0;
  if (earliest < 0) earliest = 0;
  if (latest < 0) latest = 23;
  event.dates.forEach((date) => {
    for (let i = earliest; i <= latest; i += 1) {
      const datetime = set(date, { hours: i });
      const availability = new Availability({ event: event._id, time: datetime });
      availability.save();
      event.blocks.push(availability);
    }
  });
  await event.save();
};

exports.getUserAvailability = async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
  if (!isValidObjectId(req.params.userId)) return res.sendStatus(400);
  try {
    res.sendStatus(501);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getAvailability = async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
  try {
    // initialize availability if uninitialized/incorrect format
    const event = await Event.findById(req.params.id);
    if (event.blocks == null || event.blocks.length === 0) {
      console.log('initializing');
      await this.initializeAvailability(event);
    }
    const agg = await Availability.aggregate([
      { $match: { event: ObjectId(req.params.id) } },
      {
        $project: {
          time: '$time',
          // TODO change these to timezone var
          hour: { $hour: { date: '$time', timezone: 'America/Los_Angeles' } },
          day: { $dayOfYear: { date: '$time', timezone: 'America/Los_Angeles' } },
          users: 1,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'users',
          foreignField: '_id',
          as: 'users',
        },
      },
      {
        $set: {
          'users.password': '$$REMOVE',
          'users.groups': '$$REMOVE',
          'users.email': '$$REMOVE',
          'users.invites': '$$REMOVE',
          __v: '$$REMOVE',
        },
      },
      {
        $group: {
          _id: '$day',
          times: {
            $addToSet: {
              _id: '$_id',
              userList: '$users',
              hour: '$hour',
            },
          },
          data: { $push: '$$ROOT' },
        },
      },
      { $addFields: { day: '$_id' } },
      { $project: { _id: 0 } },
      { $sort: { day: -1 } },
    ]);
    return res.send(agg);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.setAvailability = async (req, res) => {
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
};
