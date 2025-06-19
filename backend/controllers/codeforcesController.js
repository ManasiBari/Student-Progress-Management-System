const codeforcesService = require('../services/codeforcesService');

exports.syncDataForStudent = async (req, res) => {
  try {
    await codeforcesService.syncStudent(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const Contest = require('../models/contest');
const Submission = require('../models/submission');

exports.getContestHistory = async (req, res) => {
  const { studentId } = req.params;
  const { days } = req.query;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    const contests = await Contest.find({
      studentId,
      timestamp: { $gte: since }
    }).sort({ timestamp: -1 });

    res.json(contests);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching contest history' });
  }
};

exports.getProblemSolvingStats = async (req, res) => {
  const { studentId } = req.params;
  const { days } = req.query;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    const submissions = await Submission.find({
      studentId,
      timestamp: { $gte: since }
    });

    const solved = new Map();
    const buckets = {};
    let totalRating = 0;
    let count = 0;
    let maxRating = 0;
    let hardestProblem = null;

    submissions.forEach((s) => {
      const key = s.contestId + s.index;
      if (!solved.has(key)) {
        solved.set(key, true);
        totalRating += s.rating || 0;
        count++;
        if ((s.rating || 0) > maxRating) {
          maxRating = s.rating;
          hardestProblem = s;
        }

        const bucket = Math.floor((s.rating || 0) / 100) * 100;
        buckets[bucket] = (buckets[bucket] || 0) + 1;
      }
    });

    const avgRating = count ? (totalRating / count).toFixed(2) : 0;
    const problemsPerDay = (count / days).toFixed(2);

    res.json({
      totalSolved: count,
      averageRating: avgRating,
      problemsPerDay,
      hardestProblem,
      ratingBuckets: buckets
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching problem stats' });
  }
};

exports.getHeatmapData = async (req, res) => {
  const { studentId } = req.params;

  try {
    const submissions = await Submission.find({ studentId });

    const heatmap = {};

    submissions.forEach((s) => {
      const date = new Date(s.timestamp).toISOString().slice(0, 10); // yyyy-mm-dd
      heatmap[date] = (heatmap[date] || 0) + 1;
    });

    res.json(heatmap);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching heatmap data' });
  }
};
