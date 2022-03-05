const express = require('express');
const { body, oneOf } = require('express-validator');
const {
  sendInvite,
  acceptInvite,
  declineInvite,
} = require('../controllers/inviteController');

const router = express.Router();
router.post(
  '/',
  body('id').isMongoId().withMessage('Invalid target id'),
  oneOf(
    [[body('type').equals('Event')], [body('type').equals('Group')]],
    'Invite must specify either target group or event',
  ),
  sendInvite,
);

router.post('/:id/accept', acceptInvite);

router.post('/:id/decline', declineInvite);

module.exports = router;
