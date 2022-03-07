const mongoose = require('mongoose');

const { Schema } = mongoose;

const PollSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  question: String,
  maxOptionId: Number,
  // owner: { type: Schema.Types.ObjectId, ref: 'User' },
  votesAllowed: Number,
  addOptionEnabled: Boolean,
  options: [{ type: Schema.Types.ObjectId, ref: 'PollOption' }],
});

PollSchema.methods.getUserVotesNumber = async function getUserVotesNumber(user, cb) {
  try {
    console.log('poll schema', user);
    const options = await mongoose.model('PollOption').find({poll: this._id });
    let votes = 0;
    for (let i = 0; i < options.length; i += 1) {
      if (options[i].voters.includes(user)) {
        votes += 1;
      }
    }
    return votes;
  } catch (err) {
    return err;
  }
};

PollSchema.methods.userCanVoteInPoll = async function userCanVoteInPoll(user, cb) {
  try {
    const options = await mongoose.model('PollOption').find({poll: this._id });
    let votes = 0;
    for (let i = 0; i < options.length; i += 1) {
      if (options[i].voters.includes(user)) {
        votes += 1;
      }
    }
    return votes < this.votesAllowed;
  } catch (err) {
    return err;
  }
}

const Poll = mongoose.model('Poll', PollSchema);

PollSchema.pre('create', {document: false, query: true}, async (next) => {
  console.log('saveCalled');
  next();
});

PollSchema.pre('deleteOne', { document: false, query: true }, async (next) => {
  const poll = await Poll.findOne(this.getFilter());
  await mongoose.model('PollOption').deleteMany({ poll: poll._id });
  next();
});

PollSchema.pre('findOneAndDelete', { document: false, query: true }, async (next) => {
  const poll = await Poll.findOne(this.getFilter());
  await mongoose.model('PollOption').deleteMany({ poll: poll._id });
  next();
});

PollSchema.pre('deleteMany', { document: false, query: true }, async (next) => {
  const polls = await Poll.find(this.getFilter());
  const pollIds = polls.map((poll) => poll._id);
  await mongoose.model('PollOption').deleteMany({ poll: { $in: pollIds } });
  next();
});

module.exports = Poll;
