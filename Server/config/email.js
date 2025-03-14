const { google } = require('googleapis');
require('dotenv').config();

// OAuth2 Client
const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

// Gmail API client
const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

// Email templates
const emailTemplates = {
  verification: (token) => ({
    subject: 'Verify Your Email - FarmFresh',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Welcome to FarmFresh! 🌱</h2>
        <p>Thank you for registering. Please verify your email address to access all features.</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}" 
             style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
        </div>
        <p style="color: #666;">If you didn't create an account, you can safely ignore this email.</p>
        <p style="color: #666;">Best regards,<br>The FarmFresh Team</p>
      </div>
    `,
  }),
};

// Send email function
const sendEmail = async (to, template, data = {}) => {
  try {
    const { subject, html } = emailTemplates[template](data);
    const raw = Buffer.from(
      `From: "FarmFresh" <${process.env.EMAIL_USER}>\n` +
      `To: ${to}\n` +
      `Subject: ${subject}\n` +
      `Content-Type: text/html; charset=utf-8\n\n` +
      html
    )
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: raw,
      },
    });

    console.log('Email sent:', response.data.id);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Test email (optional, remove after confirmation)
sendEmail('test@example.com', 'verification', 'test-token')
  .then(() => console.log('Test email sent successfully'))
  .catch(err => console.error('Test email failed:', err));

module.exports = { sendEmail };