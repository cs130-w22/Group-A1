const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  groups: []
});

// Create model for todo
const User = mongoose.model('user', UserSchema);

module.exports = User;