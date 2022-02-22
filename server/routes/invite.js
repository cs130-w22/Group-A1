const express = require('express');
const { body, oneOf } = require('express-validator');
const { sendInvite } = require('../controllers/inviteController');
const PollOption = require('../models/pollOption');
const Event = require('../models/event');
const { EventInvite } = require('../models/invite');

const router = express.Router();
router.post(
  '/',
  body('id').isMongoId().withMessage('Invalid target id'),
  oneOf([
    [body('type').equals('Event')],
    [body('type').equals('Group')],
  ], 'Invite must specify either target group or event'),
  sendInvite,
);

module.exports = router;
