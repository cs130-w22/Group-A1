const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  dates: [{ type: Date }],
  timeEarliest: { type: Number, required: true },
  timeLatest: { type: Number, required: true },
  archived: { type: Boolean, required: true },
  finalTime: [{ type: Number }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const Event = mongoose.model('event', EventSchema);
module.exports = Event;