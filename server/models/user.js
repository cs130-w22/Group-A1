const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
  invites: [{ type: Schema.Types.ObjectId, ref: 'Invite' }],
});

// Create model for todo
const User = mongoose.model('User', UserSchema);
module.exports = User;
