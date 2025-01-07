'use server';
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { signIn } from '@/auth'; //auth
import { AuthError } from 'next-auth';

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

    await sql`
        INSERT INTO interview (email, date, company, position, round, otherround, questionanswer, username, contactInfo)
        VALUES (${formData.email},
        ${formData.date},
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

 