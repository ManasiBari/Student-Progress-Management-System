const express = require('express');
const router = express.Router();
const Submission = require('../models/submission');

// POST a new submission
router.post('/', async (req, res) => {
  try {
    const submission = new Submission(req.body);
    await submission.save();
    res.status(201).json({ success: true, submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to add submission.' });
  }
});

module.exports = router;
