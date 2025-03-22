const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = {
    name: "emailService",
    actions: {
        async sendIncidentNotification(ctx) {
            const { to, subject, html } = ctx.params;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to,
                subject,
                html
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (error) {
                console.error('Error sending email:', error);
                throw new Error('Error sending email');
            }
        }
    }
};