const { validationResult } = require('express-validator');
const { Invite } = require('../models/invite');
const User = require('../models/user');
const Event = require('../models/event');

exports.sendInvite = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const type = `${req.body.type}Invite`;
  // check if invite already exists
  const inviteBody = {
    sender: req.session.userId,
    recipient: req.body.recipient,
    target: req.body.id,
    __t: type,
  };
  try {
    // check if inviting self
    if (req.session.userId === req.body.recipient) return res.status(400).send('Cannot invite self');
    // check if existing invite
    const existingInvite = await Invite.findOne(inviteBody);
    if (existingInvite) return res.status(400).send('Invite already exists');
    // validate event
    let target;
    if (type === 'EventInvite') {
      target = await Event.findById(req.body.id);
      if (target === null) return res.status(404).send('Event does not exist');
      if (!target.members.includes(req.session.userId)) return res.status(400).send('User is not a member of this event');
      if (target.archived) return res.status(400).send('Event is archived');
    }
    const inviteDoc = new Invite(inviteBody);
    const user = await User.findById(req.body.recipient);
    if (user === null) return res.status(404).send('Recipient does not exist');
    if (target.kicked.includes(user._id)) return res.status(400).send('Recipient is kicked from this event');
    user.invites.push({ _id: inviteDoc._id });
    await inviteDoc.save();
    await user.save();
    return res.status(201).send(inviteDoc._id);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
