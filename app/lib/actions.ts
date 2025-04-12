'use server';
import bcrypt from 'bcrypt';
//import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { signIn } from '@/auth'; //auth
import { AuthError } from 'next-auth';
import { queryDatabase, queryDatabaseTypeSafe } from '../lib/db';
import { Password } from './definitions';
import { sendInterviewSubmissionEmail } from './emailnew';
import { genPassword } from './utils';

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

    const query = `
        INSERT INTO interview (email, date, company, position, round, otherround, questionanswer, username, contactInfo)
        VALUES ($1, $2, $3, $4, $5,$6, $7, $8, $9)
        ON CONFLICT (email, company, position ) DO NOTHING;
        `;
    
    // Prepare the query parameters
    const queryParams = [
      formData.email,
      formattedDate,
      formData.company,
      formData.position,
      round,
      formData.otherRound || null,
      formData.questionAnswer,
      formData.userName || null,
      formData.contactInfo || null,
    ];

    await queryDatabase(query, queryParams)
    
    //revalidate path after inserting new intervew into database
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
    
    let query = `SELECT password from interview_users where email=$1`;
    const user = await queryDatabaseTypeSafe<Password>(query, [email])
    
    if (user.length === 0) { //user.rows.length
      return {success: false, message: 'User not found.'};
    }

    const currentPasswordHash = user[0].password; //user.rows[0].password;

    // Verify the current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentPasswordHash);
    if (!isCurrentPasswordValid) {
      return { success: false, message: 'Current password is incorrect.' };
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
   
    query = `UPDATE interview_users SET password = $1 WHERE email = $2`;
    await queryDatabase(query, [newPasswordHash, email])

    return { success: true };
  } catch (error) {
    console.error('Failed to update password:', error);
    return { success: false, message: 'An error occurred. Please try again.' };
  }
}

export async function addUser(username: string, email:string, password: string) {
  // add user using the adduser page
  try {

    const hashedPassword = await bcrypt.hash(password, 10);
    const queryParam = [username, email, hashedPassword];
    const placeholders = queryParam.map((_, index) => `$${index+1}`).join(`,`)
    const query = `INSERT INTO interview_users (name, email, password)
    VALUES (${placeholders})
    ON CONFLICT (email) DO NOTHING;
    `; 
    await queryDatabase (query,queryParam);

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
      const ids = Array.from(selectedIds);
       
      // Fix: Start placeholders from index 1 since $1 is used for approver
      const placeholders = ids.map((_, index) =>`$${index + 1}`).join(', '); 

      // First, get the interview details to send emails
      const getInterviewsQuery = `
        SELECT email, username
        FROM interview
        WHERE entry_id::text in (${placeholders})
      `;
      const interviews = await queryDatabaseTypeSafe<{email: string, username: string}>(getInterviewsQuery, ids);

      // Log if no interviews were found
      if (interviews.length === 0) {
        console.error('No interviews found for the selected IDs:', ids);
        return { success: false, error: 'No interviews found for the selected IDs' };
      }

      // Update the interviews to approved status
      const updateQuery =`
          UPDATE interview
          SET approved = TRUE, approver = $${ids.length + 1}
          WHERE entry_id::text in (${placeholders})
      `;
      await queryDatabase(updateQuery, [...ids, approver]);

      // For each approved interview, generate a password and send an email
      for (const interview of interviews) {
        try {
          // Generate a random password
          const generatedPassword = genPassword();
          
          // Add user to the database with the generated password
          const hashedPassword = await bcrypt.hash(generatedPassword, 10);
          const addUserQuery = `
            INSERT INTO interview_users (name, email, password)
            VALUES ($1, $2, $3)
            ON CONFLICT (email) DO NOTHING;
          `;
          await queryDatabase(addUserQuery, [
            interview.username || 'Anonymous',
            interview.email,
            hashedPassword
          ]);
          
          // Send approval email with the generated password
          const emailResult = await sendInterviewSubmissionEmail(  
            interview.email,
            generatedPassword, 
            interview.username || 'CDS member'
          );

          if (!emailResult.success) {
            console.error('Failed to send approval email to:', interview.email, 'Error:', emailResult.error);
          } else {
            console.log('Successfully sent approval email to:', interview.email);
          }
        } catch (interviewError) {
          console.error('Error processing interview for email:', interview.email, 'Error:', interviewError);
        }
      }

      return { success: true };
    } catch (error){
      console.error('Failed to approve interviews:', error);
      return { success: false, error: 'Failed to submit approved interview '};
    }
}

