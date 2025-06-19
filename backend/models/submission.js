const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  problemName: String,
  problemRating: Number,
  verdict: String,
  problemLink: String,   
  timestamp: Date
});

module.exports = mongoose.model('Submission', submissionSchema);
