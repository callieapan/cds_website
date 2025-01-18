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
      const ids: string[] = Array.from(selectedIds);
      await sql`
          UPDATE interview
          SET approved = TRUE, approver = ${approver}
          WHERE entry_id::text = ANY(${ids})
      `;
        
        return { success: true };
      } catch (error){
        console.error('Failed to sql update interview', error)
        return { success: false, error: 'Failed to submit approved interview '};

      }


}


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