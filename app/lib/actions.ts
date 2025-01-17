'use server';
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { signIn } from '@/auth'; //auth
import { AuthError } from 'next-auth';
//import nodemailer from 'nodemailer';
import { Resend } from 'resend';







export async function submitInterview(formData: {
  email: string
  date: string
  company: string
  position: string
  round: string
  otherRound: string
  questionAnswer: string
  userName: string
  contactInfo: string

}) {
  try {
    const round =  formData.round === 'other' ? formData.otherRound : formData.round;

    // Convert date to YYYY-MM-DD format if necessary
    const formattedDate = new Date(formData.date).toISOString().split('T')[0];

    await sql`
        INSERT INTO interview (email, date, company, position, round, otherround, questionanswer, username, contactInfo)
        VALUES (${formData.email},
        ${formattedDate},
        ${formData.company},
        ${formData.position},
        ${round},
        ${formData.otherRound || null},
        ${formData.questionAnswer},
        ${formData.userName || null},
        ${formData.contactInfo || null}
        )
        ON CONFLICT (email, company, position ) DO NOTHING;
        `;
    
    revalidatePath('/interview_table')
    return { success: true };
  } catch (error){
    console.error('Failed to submit interview', error)
    return { success: false, error: 'Failed to submit interview '};

  }
  
}


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    //await signIn('credentials', formData);
    await signIn ('credentials', {
      email: formData.get('email'), 
      password: formData.get('password'),
      redirectTo: '/interviews_table', //redirect after successful login
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function updatePassword (email:string, currentPassword: string, newPassword:string) {
  //how come here we don't use props,it just regular function parameters
  // const session = await auth(); //explain why this is an await
  // if (!session?.user?.email) {
  //   return {success: false, message: 'User not authenticated.'};
  // }

  // const email = session.user.email;

  try {
    // fetch the user's current password hash from the database
    const user = await sql`SELECT password from interview_users where email=${email}`;
    if (user.rows.length === 0) {
      return {success: false, message: 'User not found.'};
    }

    const currentPasswordHash = user.rows[0].password;

    // Verify the current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentPasswordHash);
    if (!isCurrentPasswordValid) {
      return { success: false, message: 'Current password is incorrect.' };
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await sql`UPDATE interview_users SET password = ${newPasswordHash} WHERE email = ${email}`;

    return { success: true };
  } catch (error) {
    console.error('Failed to update password:', error);
    return { success: false, message: 'An error occurred. Please try again.' };
  }
}

export async function addUser(username: string, email:string, password: string) {
  try {

    const hashedPassword = await bcrypt.hash(password, 10);
    await sql`INSERT INTO interview_users (name, email, password)
        VALUES (${username}, ${email}, ${hashedPassword})
        ON CONFLICT (email) DO NOTHING;
      `;
    return { success: true };
  } catch (error){
    console.error('Failed to add user', error)
    return  { success: false, message: 'Failed to add user'}; 

  }


}

export async function approveInterview(
  selectedIds: Set<string>,
  approver: string) { 
    try {
      // Convert the Set to an array
      const ids = Array.from(selectedIds).join(',');
      
      await sql`
          UPDATE interview
          SET approved = TRUE, approver = ${approver}
          WHERE id IN (${ids})
      `;
        
        return { success: true };
      } catch (error){
        console.error('Failed to submit approved interview', error)
        return { success: false, error: 'Failed to submit approved interview '};

      }


}

// Function to send an email
// export async function sendEmail(
//   //const sendEmail = async (
//       username: string, 
//       email:string, 
//       password: string
//       //text: string
//     ) {
//     // Create a transporter object using your email service's SMTP settings
//     const transporter = nodemailer.createTransport({
//       service: 'gmail', // Example: Gmail, Yahoo, etc.
//       auth: {
//         user: process.env.EMAIL_FROM_USER, // Your email address
//         pass: process.env.EMAIL_FROM_PASSWORD, // Your email password or app-specific password
//         //user: "calliea.pan@gmail.com",
//         //pass: "HuanShao1982!",

//       },
//     });
  
//     // Construct the email message
//     const email_text = `Thank you ${username} for adding to our interview sharing repository!\n
//                     We greatly appreciate your contribution.\n
//                     \n
//                     Here is your temporary login: ${email} and password: ${password}. \n\n
//                     Please log in to the Update Password page to update your password or the View Interview page to 
//                     see other alumni interview experiences. \n
  
//                     Best of luck in your career search!\n
  
//                     NYU CDS Alumni Council\n`
  
  
  
//     // Define the email options
//     const mailOptions = {
//       from: process.env.EMAIL_FROM_USER, // Sender address
//       to: email, // Recipient address
//       subject: "Welcome to CDS Interview Sharing", // Email subject
//       text: email_text, // Email body
//     };
  
//     // Send the email
//     try {
//       await transporter.sendMail(mailOptions);
//       console.log('Email sent successfully');
//       return { success: true };
//     } catch (error) {
//       console.error('Failed to send email:', error);
//       //throw new Error('Failed to send email');
//       return { success: false, message: 'failed to send email.' };
//     }
//   }

/////resend implementation
//const RESEND_API_KEY = process.env.RESEND_API_KEY;

// export async function sendEmail(
//   // //recipientEmail
//   // username: string, 
//   // email:string, 
//   // password: string  
// ) 

// {
//   if (!RESEND_API_KEY) {
//     throw new Error('RESEND_API_KEY is not set');
//   }

//   const message = "Hello, here is your new login info...";

//   try {
//     const res = await fetch('https://api.resend.com/emails', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
//       },
//       body: JSON.stringify({
//         from: 'calliea.pan@gmail.com',//process.env.EMAIL_FROM_USER, // Replace with your verified domain
//         to: 'calliea.pan@gmail.com',
//         subject: 'Welcome to CDS Interview Sharing',
//         html: `<p>Thank you NYU Alumni for adding to our interview sharing repository!<br>
// //                     We greatly appreciate your contribution.<br><br>
// //                     
// //                     Here is your temporary login: aaa and password: bbb. <br><br>
// //                     Please log in to the Update Password page to update your password or the View Interview page to 
// //                     see other alumni interview experiences.<br><br>
  
// //                     Best of luck in your career search!<br><br>
  
// //                     NYU CDS Alumni Council</p>`,
//       }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       console.log('Email sent successfully:', data);
//       return { success: true, message: 'Email sent successfully' };
//     } else {
//       console.error('Failed to send email:', data);
//       return { success: false, message: 'Failed to send email' };
//     }
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return { success: false, message: 'Error sending email' };
//   }
// }


export async function sendEmail(
  username: string, 
  email:string, 
  password: string  
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try{
    const htmlContent = `
      <p>Thank you, NYU Alumni <strong>${username}</strong>, for adding to our interview sharing repository!</p>
      <p>Here is your temporary login information:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
      <p>Please log in to the following pages:</p>
      <ul>
        <li><a href="https://v0-cds-website-anauxk3oqku.vercel.app/login?callbackUrl=https%3A%2F%2Fv0-cds-website-anauxk3oqku.vercel.app%2Finterviews_table">Update Password</a></li>
        <li><a href="https://v0-cds-website-anauxk3oqku.vercel.app/update_password">View Interview Experiences</a></li>
      </ul>
      <p>Best of luck in your career search!</p>
      <p>NYU CDS Alumni Council</p>
    `;



    resend.emails.send({
      from: 'calliea.pan@gmail.com',
      //'onboarding@resend.dev',
      to: email,
      subject: 'welcome to CDS Interview Sharing from calliea',
      html: htmlContent
    
    });
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, message: 'Email was not sense' };
  }
}