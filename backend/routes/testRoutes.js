// 📁 routes/testRoutes.js
const express = require('express');
const router = express.Router();
const { sendReminder } = require('../services/emailService');

router.get('/send-test-email', async (req, res) => {
  try {
    await sendReminder('your_email@gmail.com', 'Test User'); // Replace with your test email
    res.json({ message: 'Test email sent successfully!' });
    console.log("Test email sent successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send test email.' });
  }
});

module.exports = router;
