import emailjs from '@emailjs/nodejs';

// This is a placeholder function that will be replaced by the client-side EmailSender component
export async function sendInterviewSubmissionEmail(to: string, password: string, username: string) {
  try {
    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      {
        to_email: to,
        password: password,
        username: username
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!
      }
    );
    
    if (result.status === 200) {
      return { success: true };
    } else {
      console.error('EmailJS returned non-200 status:', result.status);
      return { success: false, error: 'Failed to send email' };
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}
