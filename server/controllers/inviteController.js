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
  try {
    // get recipient
    const recipient = await User.findOne({ username: req.body.recipient });
    if (recipient == null) return res.status(400).send('Recipient does not exist');

    // check if inviting self
    if (req.session.userId === recipient._id) return res.status(400).send('You can\'t invite yourself!');

    // craft body
    const inviteBody = {
      sender: req.session.userId,
      recipient,
      target: req.body.id,
      __t: type,
    };

    // check if existing invite
    const existingInvite = await Invite.findOne(inviteBody);
    if (existingInvite) return res.status(400).send('Invite already exists');

    // validate event
    let target;
    if (type === 'EventInvite') {
      target = await Event.findById(req.body.id);
      if (target === null) return res.status(404).send('Event does not exist');
      if (!target.members.includes(req.session.userId)) return res.status(400).send('You\'re not a member of this event');
      if (target.members.includes(recipient._id)) return res.status(400).send('Recipient is already a member');
      if (target.archived) return res.status(400).send('Event is archived');
      if (target.kicked.includes(recipient._id)) return res.status(400).send('Recipient is kicked from this event');
    }

    // create invite
    const inviteDoc = new Invite(inviteBody);
    recipient.invites.push({ _id: inviteDoc._id });
    await inviteDoc.save();
    await recipient.save();
    return res.status(201).send(inviteDoc);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
