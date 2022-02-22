const mongoose = require('mongoose');

const { Schema } = mongoose;

const InviteSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  recipient: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['accepted', 'declined', 'active'] },
}, { timestamps: true });

const EventInviteSchema = new Schema({
  target: { type: Schema.Types.ObjectId, ref: 'event' },
});

// Create model for invite
const Invite = mongoose.model('Invite', InviteSchema);
const EventInvite = Invite.discriminator('EventInvite', EventInviteSchema);

// const GroupInvite = Invite.discriminator('GroupInvite', GroupInviteSchema);

module.exports = { Invite, EventInvite };
