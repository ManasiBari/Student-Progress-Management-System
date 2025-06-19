const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // example: yourapp@gmail.com
    pass: process.env.EMAIL_PASS  // Gmail app password, not actual password
  }
});

exports.sendReminder = async (to, name) => {
  try {
    await transporter.sendMail({
      from: `"Student Progress Manager" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Codeforces Inactivity Alert',
      text: `Hi ${name},\n\nWe noticed you haven’t made any submissions recently.\nTime to get back on track and solve some problems!\n\nBest,\nStudent Progress Team`
      // You could add an html field here for better formatting
    });
    console.log(`Reminder email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send reminder to ${to}`, error);
  }
};
