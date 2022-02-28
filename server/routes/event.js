const express = require('express');
const { isValidObjectId } = require('mongoose');

const router = express.Router();
const { body } = require('express-validator');
const {
  getEvent, createEvent, joinEvent, leaveEvent,
} = require('../controllers/eventController');
const { getUserAvailability, getAvailability, setAvailability } = require('../controllers/availabilityController');
const { EventInvite } = require('../models/invite');
const Poll = require('../models/poll');

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
router.post('/:id/availability/update', setAvailability);

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
