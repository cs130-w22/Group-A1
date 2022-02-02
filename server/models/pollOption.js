const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Poll = require('./poll')

const PollOptionSchema = new Schema({
	poll: {type: Schema.Types.ObjectId, ref: 'Poll'},
 	text: String,
 	votes: Number,
  	voters: []
});

PollOptionSchema.statics.pollOptionsByPollID = function(pollid) {
	PollOption.find({poll: pollid})
		.then((pollOptions) => pollOptions)
		.catch((error) => console.log(error))
}

const PollOption = mongoose.model('PollOption', PollOptionSchema);

module.exports = PollOption;