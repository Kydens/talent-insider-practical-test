const transporter = require('../config/email');

const sendEmail = async (to, subject, message, html = null) => {
  try {
    const mailOptions = await transporter.sendMail({
      from: '"Talent Insider Practical Test" <youremail@gmail.com>',
      to: to,
      subject: subject,
      text: message,
      html: html ?? undefined,
    });

    console.log('Email sent: %s', mailOptions.mesage);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};

const getActivationEmailHtml = (firstName, OtpCode) => `
  <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; display: relative;">
    <h2 style="color: #2c3e50;">Halo ${firstName},</h2>
    <p>Terima kasih telah mendaftar.</p>
    <p>Kode OTP untuk aktivasi akun Anda:</p>
    <div style="text-align: center; margin: 30px 0;">
      <h1>${OtpCode}</h1>
    </div>
    <p style="font-size: 14px; color: #555;">Jika Anda tidak merasa mendaftar, silakan abaikan email ini.</p>
    <hr style="margin-top: 40px;">
  </div>
`;

module.exports = { sendEmail, getActivationEmailHtml };
