const Student = require('../models/student');
const { fetchCodeforcesData } = require('../services/codeforcesService');

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
};

exports.addStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();

    // If cfHandle exists, fetch Codeforces data asynchronously
    if (student.codeforcesHandle) {
      await fetchCodeforcesData(student._id, student.codeforcesHandle);
    }

    res.status(201).json({ success: true, student });
  } catch (err) {
    console.error('Error adding student:', err);
    res.status(500).json({ error: 'Failed to add student.' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ success: true, student });
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ error: 'Failed to update student.' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ success: true, message: 'Student deleted' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Failed to delete student.' });
  }
};

exports.updateCFHandle = async (req, res) => {
  try {
    const { cfHandle } = req.body;
    const student = await Student.findById(req.params.id);

    if (!student) return res.status(404).json({ error: 'Student not found' });

    student.codeforcesHandle = cfHandle;
    student.lastSynced = null; // reset sync timestamp
    await student.save();

    // Fetch new Codeforces data after updating handle
    await fetchCodeforcesData(student._id, cfHandle);

    res.json({ success: true, message: 'CF handle updated and data synced', student });
  } catch (err) {
    console.error('Error updating CF handle:', err);
    res.status(500).json({ error: 'Failed to update CF handle.' });
  }
};
