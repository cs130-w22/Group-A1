const mongoose = require('mongoose');

const { Schema } = mongoose;

const EventSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  dates: [{ type: Date }],
  timeEarliest: { type: Number, required: true },
  timeLatest: { type: Number, required: true },
  archived: { type: Boolean, required: true },
  finalTime: [{ type: Number }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  invitees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Event = mongoose.model('event', EventSchema);
module.exports = Event;
