/** Express router providing invite related routes
 * @module routers/invite
 * @requires express
 */

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

/**
 * Accept an invite
 * @name GET/invite/:id/accept
 * @function
 * @memberof module:routers/invite
 * @inner
 */
router.post('/:id/accept', acceptInvite);

/**
 * Decline an invite
 * @name GET/invite/:id/decline
 * @function
 * @memberof module:routers/invite
 * @inner
 */
router.post('/:id/decline', declineInvite);

module.exports = router;
