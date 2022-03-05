const mongoose = require('mongoose');

const { Schema } = mongoose;

const AvailabilitySchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  time: Date,
});

const Availability = mongoose.model('availability', AvailabilitySchema);
module.exports = Availability;
