const brevo = require('@getbrevo/brevo');

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

async function sendEmail({ to, subject, htmlContent }) {
  const email = new brevo.SendSmtpEmail();
  email.sender = { name: 'WasteWise', email: 'ayandiranebunoluwa@gmail.com' };
  email.to = [{ email: to }];
  email.subject = subject;
  email.htmlContent = htmlContent;

  try {
    const result = await apiInstance.sendTransacEmail(email);
    console.log('Email sent:', result.body?.messageId || result);
    return result;
  } catch (err) {
    console.error('Brevo send error:', err.response?.body || err.message);
    throw err;
  }
}

module.exports = sendEmail;