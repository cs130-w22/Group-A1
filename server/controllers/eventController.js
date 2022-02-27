const Event = require('../models/event');
const Availability = require('../models/availability');

require('../models/event');
const { isValidObjectId } = require('mongoose');
const { ObjectId } = require('mongodb');

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
}

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
exports.getUserAvailability = async (req, res) => {
    if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
    if (!isValidObjectId(req.params.userId)) return res.sendStatus(400);
    try {
        const agg = await Availability.aggregate([
            {
                $match: {
                    event: ObjectId(req.params.id),
                    users: ObjectId(req.params.userId),
                },
            },
            {
                $project:
                {
                    hour: { $hour: '$time' },
                    day: { $dayOfYear: '$time' },
                },
            },
            {
                $group: {
                    _id: '$day',
                    hours: { $push: '$hour' },
                },
            },
        ]);
        // console.log(avail);
        return res.send(agg);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};


exports.getAvailability = async (req, res) => {
    if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
    try {
        const agg = await Availability.aggregate([
            {
                $match: {
                    event: ObjectId(req.params.id),
                },
            },
            {
                $project:
                {
                    time: '$time',
                    // TODO change these to timezone var
                    hour: { $hour: { date: '$time', timezone: 'America/Los_Angeles' } },
                    day: { $dayOfYear: { date: '$time', timezone: 'America/Los_Angeles' } },
                    users: 1
                },
            },
            {
                $group: {
                    _id: '$day',
                    times: {
                        $addToSet: {
                            _id: "$_id",
                            userList: '$users',
                            hour: '$hour',
                        }
                    },
                    data: { $push: '$$ROOT' }
                },
            },
            {
                $addFields: { day: "$_id" }
            },
            {
                $project: { _id: 0 }
            },
            {
                $sort: { day: -1 }
            }
        ]);
        const result = await Availability.populate(agg, { path: "times.users", select: "username" });
        return res.send(agg);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};