const express = require('express');
const router = express.Router();
const Contest = require('../models/contest');

// POST a new contest
router.post('/', async (req, res) => {
  try {
    const contest = new Contest(req.body);
    await contest.save();
    res.status(201).json({ success: true, contest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to add contest.' });
  }
});

module.exports = router;
