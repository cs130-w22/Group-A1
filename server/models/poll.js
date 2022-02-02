const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PollSchema = new Schema({
  max_option_id: Number,
  //owner: {type: Schema.Types.ObjectId, ref: 'User'},
  //event: {type: Schema.Types.ObjectId, ref:'Event'},
  votes_allowed: Number,
  add_option_enabled: Boolean
});

/*
PollSchema.statics.findByEvent = function(event) {
  return this.find({event: event})
}
*/

PollSchema.statics.deleteAllOptions = function(pollid) {
  PollOption.deleteMany({poll: pollid})
    .then(() => console.log("data deleted"))
    .catch((error) => console.log("error"))
}

const Poll = mongoose.model('Poll', PollSchema);

module.exports = Poll;