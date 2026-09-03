const { BrevoClient } = require('@getbrevo/brevo');

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

async function sendEmail({ to, subject, htmlContent }) {
  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject,
      htmlContent,
      sender: { name: 'WasteWise', email: 'ayandiranebunoluwa@gmail.com' },
      to: [{ email: to }],
    });
    console.log('Email sent:', result);
    return result;
  } catch (err) {
    console.error('Brevo send error:', err.message || err);
    throw err;
  }
}

module.exports = sendEmail;