const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Event = require('../models/event');

// TODO:
// - Add owner to the document 
router.post(
  '/',
  body('name')
    .exists().withMessage('Please enter an event name'),
  (req, res) => {
    const { userId } = req.session;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    Event.deleteMany();
    const event = new Event({
      name: req.body.name,
      description: req.body.description,
      dates: req.body.dates,
      timeEarliest: req.body.timeEarliest,
      timeLatest: req.body.timeLatest,
      archived: false,
      owner: mongoose.Types.ObjectId(userId),
      members: [mongoose.Types.ObjectId(userId)]
    });
    event.save()
      .then(result => res.send(result._id))
      .catch(err => console.log(err));
  },
);

// TODO:
// - Only members of the event can view page
// - Send 404 if ID is invalid
router.get(
  '/:id',
  (req, res) => {
    Event.findById(req.params.id)
      .then(result => res.send(result))
      .catch(err => console.log(err));
  }
)

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
