const axios = require('axios');
const Student = require('../models/student');
const Contest = require('../models/contest');
const Submission = require('../models/submission');

exports.syncStudent = async (studentId) => {
  const student = await Student.findById(studentId);
  const handle = student.codeforcesHandle;

  const contestRes = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
  const submissionsRes = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);

  await Contest.deleteMany({ studentId });
  await Submission.deleteMany({ studentId });

  const contests = contestRes.data.result.map(c => ({
    studentId,
    contestId: c.contestId,
    contestName: c.contestName,
    ratingChange: c.newRating - c.oldRating,
    newRating: c.newRating,
    rank: c.rank,
    timestamp: new Date(c.ratingUpdateTimeSeconds * 1000),
    unsolvedProblems: 0 // Optional: calculate later
  }));

  const submissions = submissionsRes.data.result.map(s => ({
    studentId,
    problemName: s.problem.name,
    rating: s.problem.rating || 0,
    verdict: s.verdict,
    timestamp: new Date(s.creationTimeSeconds * 1000)
  }));

  await Contest.insertMany(contests);
  await Submission.insertMany(submissions);

  student.currentRating = contests[contests.length - 1]?.newRating || 0;
  student.maxRating = Math.max(...contests.map(c => c.newRating), 0);
  student.lastSynced = new Date();
  await student.save();
};

