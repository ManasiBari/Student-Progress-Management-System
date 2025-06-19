const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student', 
    required: true,
  },
  contestId: {
    type: Number,
    required: true,
  },
  contestName: {
    type: String,
    required: true,
  },
  ratingChange: {
    type: Number,
    required: true,
  },
  newRating: {
    type: Number,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  unsolvedProblems: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Contest', contestSchema);
