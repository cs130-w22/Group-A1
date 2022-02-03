const mongoose = require('mongoose');
const PollOption = require('./pollOption');
const Schema = mongoose.Schema;

const PollSchema = new Schema({
  maxOptionId: Number,
  //owner: {type: Schema.Types.ObjectId, ref: 'User'},
  //event: {type: Schema.Types.ObjectId, ref:'Event'},
  votesAllowed: Number,
  addOptionEnabled: Boolean,
  options: [{ type: Schema.Types.ObjectId, ref: 'PollOption' }]
});

PollSchema.pre('deleteOne', { document: false, query: true }, function (next) {
  const poll = this.model.findOne(this.getFilter())
    .then(() => {
      PollOption.deleteMany({ poll: poll._id })
        .then(() => next())
    });
});

PollSchema.pre('findOneAndDelete', { document: false, query: true }, function (next) {
  const poll = this.model.findOne(this.getFilter())
    .then(() => {
      PollOption.deleteMany({ poll: poll._id })
        .then(() => next())
    });
});

PollSchema.pre('deleteMany', function (next) {
  const polls = this.model.find(this.getFilter())
    .then(() => {
      const pollIds = polls.map((poll) => poll._id);
      PollOption.deleteMany({ poll: { $in: pollIds } })
        .then(() => next())
    });
});

const Poll = mongoose.model('Poll', PollSchema);
module.exports = Poll;