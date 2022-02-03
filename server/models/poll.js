const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PollOption = require('./pollOption')

const PollSchema = new Schema({
  question: String,
  maxOptionId: Number,
  //owner: {type: Schema.Types.ObjectId, ref: 'User'},
  //event: {type: Schema.Types.ObjectId, ref:'Event'},
  votesAllowed: Number,
  addOptionEnabled: Boolean,
  options: [{ type: Schema.Types.ObjectId, ref: 'PollOption' }]
});

PollSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
  const poll = await Poll.findOne(this.getFilter())
  await mongoose.model('PollOption').deleteMany({ poll: poll._id });
  next();
});

PollSchema.pre('findOneAndDelete', { document: false, query: true }, async function (next) {
  const poll = await Poll.findOne(this.getFilter())
  await mongoose.model('PollOption').deleteMany({ poll: poll._id });
  next();
});

PollSchema.pre('deleteMany', { document: false, query: true }, async function (next) {
  const polls = await Poll.find(this.getFilter())
  const pollIds = polls.map((poll) => poll._id)
  await mongoose.model('PollOption').deleteMany({ poll: { $in: pollIds } });
  next();
});

const Poll = mongoose.model('Poll', PollSchema);
module.exports = Poll;