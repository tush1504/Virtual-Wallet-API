const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your SMTP service
  auth: {
    user: process.env.EMAIL_USER,      // must be defined
    pass: process.env.EMAIL_PASS       // must be defined
  }
});

const sendDetails = async ({ to, subject, html }) => {
  if (!to || typeof to !== 'string' || to.trim() === '') {
    throw new Error('No recipients defined'); // add this validation!
  }

  return transporter.sendMail({
    from: `"Fintech Wallet" <${process.env.EMAIL_USER}>`, // important
    to,
    subject,
    html
  });
};

module.exports = sendDetails;
