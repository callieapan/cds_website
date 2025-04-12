import nodemailer from 'nodemailer';

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },
});

export async function sendInterviewSubmissionEmail(to: string, password: string, username: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Thank you for contributing to CDS Interview Sharing Forum',
    html: `
      <h2>Your interview submission has been approved!</h2>
      <p>Dear ${username},</p>
      <p>You can now access the interview log using the following temporary credentials:</p>
      <p>Email: ${to}</p>
      <p>Temporary Password: <strong>${password}</strong></p>
      <p>Please change this password after your first login for security reasons.</p>
      <p>To update your password, please visit: <a href="https://v0-cds-website-anauxk3oqku.vercel.app/update_password">Update Password</a></p>
      <p>To view the interview log, please visit: <a href="https://v0-cds-website-anauxk3oqku.vercel.app">CDS Interview Log</a></p>
      <p>Thank you for contributing to our community!</p>
      <p>Best regards,<br>CDS Alumni Council</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email' };
  }
} 