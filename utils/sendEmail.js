const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, html,text) => {
    await transporter.sendMail({
        from: `"Fintech Wallet" <${process.env.EMAIL_USER}>`,
        to, 
        subject,
        text: text || undefined,   // optional fallback
        html: html || undefined 
        });
};

module.exports = sendEmail;
