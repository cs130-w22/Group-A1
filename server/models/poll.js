const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PollSchema = new Schema({
  poll-text: String,
  votes: Number,
  voters: []
});
