const express = require('express');

const router = express.Router();
const PollOption = require('../models/pollOption');
const Poll = require('../models/poll');

// toggle vote of current user
router.post('/vote', (req, res) => {
  PollOption.findById(req.body.optionId)
    .then((option) => {
      const { userId } = req.session;
      if (option == null) return res.sendStatus(404);
      if (option.voters.includes(userId)) {
        option.voters.pull({ _id: userId });
      } else {
        option.voters.push({ _id: userId });
      }
      option.save();
      res.status(200).send(option);
    }).catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

// get all options
router.get('/options', (req, res) => {
  PollOption.find().then((options) => {
    res.json(options);
  }).catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});
// delete option
router.delete('/options/:optionId', (req, res) => {
  PollOption.findOneAndDelete({ _id: req.params.optionId })
    .then((deleted) => (deleted ? res.json(deleted) : res.sendStatus(404)))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

// delete all options
router.delete('/options', (req, res) => {
  PollOption.deleteMany()
    .then(() => res.sendStatus(204))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

// get all polls
router.get('/', (req, res) => {
  Poll.find()
    .populate('options')
    .then((polls) => res.json(polls))
    .catch((err) => console.log(err));
});

// add poll
router.post('/', (req, res) => {
  Poll.create(req.body).then((poll) => res.json(poll))
    .catch((err) => console.log(err));
});

// get poll
router.get('/:id', (req, res) => {
  Poll.findById(req.params.id)
    .populate('options')
    .then((data) => ((data) ? res.json(data) : res.sendStatus(404)))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

// add option
router.post('/:id/options', (req, res) => {
  const pollId = req.params.id;
  if (req.body.text?.length === 0) { return res.status(400).send('Option text cannot be blank'); }
  Poll.findById(pollId)
    .then((poll) => {
      if (poll == null) return res.sendStatus(404);
      PollOption.create({
        poll: pollId,
        text: req.body.text,
        votes: req.body.votes || 0,
        voters: req.body.voters || [],
      }).then((option) => {
        poll.options.push(option);
        poll.save()
          .then(() => res.status(201).json(option))
          .catch((err) => {
            console.error(err);
            res.sendStatus(500);
          });
      }).catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
    }).catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

// update option
router.patch('/options/:optionId', (req, res) => {
  const { optionId } = req.params;
  const { update } = req.body;
  PollOption.findOneAndUpdate({ _id: optionId }, update, {
    new: true,
  }).then((data) => (data ? res.json(data) : res.sendStatus(404)))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

// get poll options
router.get('/:id/options', (req, res) => {
  Poll.findById(req.params.id, 'options')
    .populate('options')
    .then((data) => ((data) ? res.json(data) : res.sendStatus(404)))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

// delete all polls
router.delete('/', (req, res) => {
  Poll.deleteMany()
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

// delete poll by id
router.delete('/:id', (req, res) => {
  Poll.deleteOne({ _id: req.params.id })
    .then((data) => {
      if (data.n === 0) return res.sendStatus(404);
      res.sendStatus(204);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

module.exports = router;
