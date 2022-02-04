const mongoose = require('mongoose');

const { Schema } = mongoose;

const PollOptionSchema = new Schema({
  poll: { type: Schema.Types.ObjectId, ref: 'Poll' },
  text: String,
  voters: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const PollOption = mongoose.model('PollOption', PollOptionSchema);
PollOptionSchema.statics.pollOptionsByPollID = (pollid) => {
  PollOption.find({ poll: pollid })
    .then((pollOptions) => pollOptions)
    .catch((error) => console.log(error));
};

module.exports = PollOption;
