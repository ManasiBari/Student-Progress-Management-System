const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  cfHandle: String,
  currentRating: Number,
  maxRating: Number,
  lastSynced: Date,
  lastSyncedAt: { type: Date },

  emailRemindersSent: { type: Number, default: 0 },
  emailDisabled: { type: Boolean, default: false }
});

module.exports = mongoose.model('student', studentSchema);

