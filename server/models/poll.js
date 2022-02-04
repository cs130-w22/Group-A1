const mongoose = require('mongoose');

const { Schema } = mongoose;

const PollSchema = new Schema({
  question: String,
  maxOptionId: Number,
  // owner: { type: Schema.Types.ObjectId, ref: 'User' },
  // event: {type: Schema.Types.ObjectId, ref:'Event'},
  votesAllowed: Number,
  addOptionEnabled: Boolean,
  options: [{ type: Schema.Types.ObjectId, ref: 'PollOption' }],
});

const Poll = mongoose.model('Poll', PollSchema);
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
