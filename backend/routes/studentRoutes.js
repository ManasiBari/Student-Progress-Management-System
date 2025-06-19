const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const Contest = require('../models/contest');
const Submission = require('../models/submission');

// Basic student CRUD routes
router.get('/', studentController.getAllStudents);
router.post('/', studentController.addStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);
router.put('/:id/cfhandle', studentController.updateCFHandle);


router.get('/:id/contests', async (req, res) => {
  const { id } = req.params;
  const days = parseInt(req.query.days) || 365;
  const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    const contests = await Contest.find({
      studentId: id,
      timestamp: { $gte: fromDate }
    }).sort({ timestamp: -1 });

    res.json({ success: true, contests });
  } catch (err) {
    console.error('Error fetching contest history:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch contest history.' });
  }
});

// Submission stats route
router.get('/:id/stats', async (req, res) => {
  const { id } = req.params;
  const days = parseInt(req.query.days) || 90;
  const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    const submissions = await Submission.find({
      studentId: id,
      verdict: 'OK',
      timestamp: { $gte: fromDate }
    });

    if (submissions.length === 0) {
      return res.json({ success: true, stats: null });
    }

    const total = submissions.length;
    const ratingSum = submissions.reduce((sum, s) => sum + (s.problemRating || 0), 0);
    const avgRating = ratingSum / total;
    const daysSpan = Math.ceil((Date.now() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    const avgPerDay = total / daysSpan;

    const mostDifficult = submissions.reduce((max, curr) =>
      (curr.problemRating || 0) > (max.problemRating || 0) ? curr : max
    );

    const ratingBuckets = {};
    submissions.forEach(s => {
      const rating = Math.floor((s.problemRating || 0) / 100) * 100;
      ratingBuckets[rating] = (ratingBuckets[rating] || 0) + 1;
    });

    const heatmap = {};
    submissions.forEach(s => {
      const date = new Date(s.timestamp).toISOString().split('T')[0];
      heatmap[date] = (heatmap[date] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        total,
        avgRating,
        avgPerDay,
        mostDifficult: {
          name: mostDifficult.problemName,
          rating: mostDifficult.problemRating,
          link: mostDifficult.problemLink
        },
        ratingBuckets,
        heatmap
      }
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch problem stats.' });
  }
});

module.exports = router;
