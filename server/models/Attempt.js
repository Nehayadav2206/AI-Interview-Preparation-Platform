const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  question: String,
  answer: String,
  score: Number,
  feedback: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Attempt", attemptSchema);
