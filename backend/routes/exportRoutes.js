const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const Student = require('../models/student');

router.get('/export/students', async (req, res) => {
  try {
    const students = await Student.find().lean();

    const fields = ['name', 'email', 'phone', 'codeforcesHandle', 'currentRating', 'maxRating'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(students);

    res.header('Content-Type', 'text/csv');
    res.attachment('students.csv');
    return res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to export student data');
  }
});

module.exports = router;
