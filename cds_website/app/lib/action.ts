'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';


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
    return { success: false, error: 'Failed to submit interview ' + error.message};

  }
  
}

