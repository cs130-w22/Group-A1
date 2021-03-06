/** Express router providing poll related routes
 * @module routers/polls
 * @requires express
 */

const express = require('express');

const router = express.Router();
const PollOption = require('../models/pollOption');
const Poll = require('../models/poll');
const Event = require('../models/event');
const User = require('../models/user');

/**
 * Toggle vote of current user (only if toggle does not exceed allotted votes)
 * @name POST/polls/vote
 * @function
 * @memberof module:routers/polls
 * @inner
 * @param {express.Request} req.body Request body
 * @param {string} req.body.optionId Option ID
 * @param {express.Request} req.session Current user session
 */
router.post('/vote', (req, res) => {
  PollOption.findById(req.body.optionId)
    .populate({
      path: 'poll',
      populate: {
        path: 'event',
        model: Event,
      },
    })
    .then(async (option) => {
      const { userId } = req.session;
      User.findById(userId, 'username').then(async (user) => {
        if (option == null || option.poll == null || option.poll.event == null) return res.sendStatus(404);
        if (option.poll.event.archived === true) return res.sendStatus(403);
        console.log("found", option.voters.includes(user));
        if (option.voters.includes(userId)) {
          option.voters.splice(option.voters.findIndex((v) => v === userId), 1);
          option.save().then((saved) => {
            res.status(200).send(saved);
          });
        } else {
          option.poll.getUserVotesNumber(userId).then(async (currentVotes) => {
            if (currentVotes < option.poll.votesAllowed) {
              option.voters.push(user);
              await option.save();
              if (currentVotes === option.poll.votesAllowed - 1) res.status(201);
              else res.status(200);
              res.send(option);
            } else res.status(202).send('User Votes Exceeded');
          }).catch((err) => {
            console.error(err);
            res.sendStatus(500);
          });
        }
      }).catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Update a poll
 * @name PATCH/polls/:id
 * @function
 * @memberof module:routers/polls
 * @inner
 * @param {string} id Poll ID
 * @param {express.Request} req.body Request body
 * @param {express.Request} req.session Current user session
 */
router.patch('/:id', (req, res) => {
  const { update } = req.body;
  Poll.findById(req.params.id)
    .populate({
      path: 'event',
      model: Event,
    })
    .then((poll) => {
      if (poll == null || poll.event == null) return res.sendStatus(404);
      if (poll.event.archived === true) return res.sendStatus(403);
      Poll.findOneAndUpdate({ _id: req.params.id }, update, {
        new: true,
      })
        .populate({
          path: 'options',
          populate: {
            path: 'voters',
            select: '_id username',
          },
        })
        .then(async (data) => {
          if (data) {
            const { userId } = req.session;
            const pollCanVote = await data.userCanVoteInPoll(userId);
            res.json({ pData: data, canVote: pollCanVote });
          } else res.sendStatus(404);
        });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Get all options
 * @name GET/polls/options
 * @function
 * @memberof module:routers/polls
 * @inner
 * @return {pollOption[]} Poll Options
 */
router.get('/options', (req, res) => {
  PollOption.find()
    .populate('voters', '_id username')
    .then((options) => {
      res.json(options);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Delete a poll option
 * @name DELETE/polls/options/:optionId
 * @function
 * @memberof module:routers/polls
 * @inner
 * @param {string} optionId Poll Option ID
 */
router.delete('/options/:optionId', (req, res) => {
  PollOption.findById(req.params.optionId)
    .populate({
      path: 'poll',
      populate: {
        path: 'event',
        model: Event,
      },
    })
    .then((option) => {
      if (option == null
        || option.poll == null
        || option.poll.event == null) {
        return res.sendStatus(404);
      }
      if (option.poll.event.archived === true) return res.sendStatus(403);
      PollOption.findOneAndDelete({ _id: req.params.optionId }).then(
        (deleted) => (deleted ? res.json(deleted) : res.sendStatus(404)),
      );
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Delete all Options
 * @name DELETE/polls/options/
 * @function
 * @memberof module:routers/polls
 * @inner
 */
router.delete('/options', (req, res) => {
  PollOption.deleteMany()
    .then(() => res.sendStatus(204))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Get all polls
 * @name GET/polls/
 * @function
 * @memberof module:routers/polls
 * @inner
 */
router.get('/', (req, res) => {
  Poll.find()
    .populate('options')
    .then((polls) => res.json(polls))
    .catch((err) => console.error(err));
});

/**
 * Create a new poll
 * @name POST/polls/
 * @function
 * @memberof module:routers/polls
 * @param {express.Request} req.body Request body
 * @param {string} req.body.event Event ID
 * @inner
 */
router.post('/', (req, res) => {
  Event.findById(req.body.event)
    .then((event) => {
      if (event.archived === true) return res.sendStatus(403);
      Poll.create(req.body).then((poll) => {
        res.json({ pData: poll, canVote: true });
      }).catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
    }).catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Get a poll
 * @name POST/polls/:id
 * @function
 * @memberof module:routers/polls
 * @param {string} id Poll ID
 * @param {express.Request} req.session Current User Session
 * @inner
 */
router.get('/:id', (req, res) => {
  Poll.findById(req.params.id)
    .populate({
      path: 'options',
      populate: {
        path: 'voters',
        select: '_id username',
      },
    })
    .then((data) => {
      if (data) {
        const { userId } = req.session;
        data.userCanVoteInPoll(userId).then((result) => {
          res.json({ pData: data, canVote: result });
        }).catch((err) => {
          console.error(err);
          res.sendStatus(500);
        });
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Add an option to a poll
 * @name POST/polls/:id/options
 * @function
 * @memberof module:routers/polls
 * @param {string} id Poll ID
 * @param {express.Request} req.body Request Body
 * @param {string} req.body.text Poll option description
 * @param {int} req.body.votes (Optional) Poll option votes
 * @param {Users[]} req.body.voters (Optional) Users voting for this option
 * @inner
 */
router.post('/:id/options', (req, res) => {
  const pollId = req.params.id;
  if (req.body.text.length === 0) {
    return res.status(400).send('Option text cannot be blank');
  }
  Poll.findById(pollId)
    .populate({
      path: 'event',
      model: Event,
    })
    .then((poll) => {
      if (poll == null || poll.event == null) return res.sendStatus(404);
      if (poll.event.archived === true) return res.sendStatus(403);
      PollOption.create({
        poll: pollId,
        text: req.body.text,
        votes: req.body.votes || 0,
        voters: req.body.voters || [],
      })
        .then((option) => {
          option.populate({
            path: 'voters',
            select: '_id username',
          }).execPopulate().then((popOpt) => {
            poll.options.push(popOpt);
            poll.maxOptionId++;
            poll
              .save()
              .then(() => res.status(201).json(popOpt))
              .catch((err) => {
                console.error(err);
                res.sendStatus(500);
              });
          }).catch((err) => {
            console.error(err);
            res.sendStatus(500);
          });
        })
        .catch((err) => {
          console.error(err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Update a poll option
 * @name PATCH/polls/:id/:optionId
 * @function
 * @memberof module:routers/polls
 * @param {string} optionId Poll Option ID
 * @param {express.Request} req.body Update
 * @param {express.Request} req.session Current User Session
 * @inner
 */
router.patch('/options/:optionId', (req, res) => {
  const { optionId } = req.params;
  const { update } = req.body;
  PollOption.findById(optionId)
    .populate({
      path: 'poll',
      populate: {
        path: 'event',
        model: Event,
      },
    })
    .then((option) => {
      const { userId } = req.session;
      if (option == null || option.poll == null || option.poll.event == null) { return res.sendStatus(404); }
      if (option.poll.event.archived == true) return res.sendStatus(403);
      PollOption.findOneAndUpdate({ _id: optionId }, update, {
        new: true,
      }).then((data) => (data ? res.json(data) : res.sendStatus(404)));
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Get poll options for a poll
 * @name GET/polls/:id/options
 * @function
 * @memberof module:routers/polls
 * @param {string} id Poll ID
 * @inner
 */
router.get('/:id/options', (req, res) => {
  Poll.findById(req.params.id, 'options')
    .populate({
      path: 'options',
      populate: {
        path: 'voters',
        select: '_id username',
      },
    }).exec()
    .then((data) => (data ? res.json(data) : res.sendStatus(404)))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Delete all polls
 * @name DELETE/polls
 * @function
 * @memberof module:routers/polls
 * @inner
 */
router.delete('/', (req, res) => {
  Poll.deleteMany()
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

/**
 * Delete a poll
 * @name DELETE/polls/:id
 * @function
 * @memberof module:routers/polls
 * @param {string} id Poll ID
 * @inner
 */
router.delete('/:id', (req, res) => {
  Poll.findById(req.params.id)
    .populate({
      path: 'event',
      model: Event,
    })
    .then((poll) => {
      if (poll == null || poll.event == null) return res.sendStatus(404);
      if (poll.event.archived == true) return res.sendStatus(403);
      Poll.findOneAndDelete({ _id: req.params.id }).then((deleted) => {
        if (deleted == null) return res.sendStatus(404);
        res.json({ _id: deleted._id });
      });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

module.exports = router;
