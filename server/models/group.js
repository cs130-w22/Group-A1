const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }]
});

// Create model for todo
const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;