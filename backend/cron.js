
const cron = require('node-cron');
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const Student = require('./models/student');
const Submission = require('./models/submission');
const { syncStudent } = require('./services/codeforcesService');
const { sendReminder } = require('./services/emailService');

// DB connect if needed (for standalone run)
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('MongoDB connected (cron)'))
    .catch((err) => console.error('MongoDB connection error (cron):', err));
}

// Default: runs every day at 2 AM
const CRON_SCHEDULE = process.env.CRON_TIME || '0 2 * * *'; // You can override via .env

cron.schedule(CRON_SCHEDULE, async () => {
  console.log(`[Cron] ⏰ Starting scheduled sync at ${new Date().toLocaleString()}`);

  try {
    const students = await Student.find();

    for (const student of students) {
      try {
        console.log(`[Cron] 🔄 Syncing ${student.name}`);
        await syncStudent(student._id);
        student.lastSyncedAt = new Date();

        const recentSubmissions = await Submission.find({
          studentId: student._id,
          timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });

        if (recentSubmissions.length === 0 && !student.emailDisabled) {
          console.log(`[Cron]  Sending inactivity reminder to ${student.email}`);
          await sendReminder(student.email, student.name);
          student.emailRemindersSent = (student.emailRemindersSent || 0) + 1;
        }

        await student.save();
      } catch (err) {
        console.error(`[Cron] ❌ Error processing student ${student.name}:`, err.message);
      }
    }

    console.log(`[Cron] ✅ Sync completed at ${new Date().toLocaleString()}`);
  } catch (err) {
    console.error('[Cron] ❌ Unexpected cron error:', err.message);
  }
});
