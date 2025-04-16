const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send SMS function
const sendSMS = async (to, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      to,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendSMS
}; 