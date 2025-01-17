import { sql } from '@vercel/postgres'
import {
    InterviewData,
    InterviewDataAll,
    User,
  
} from './definitions'

export async function fetchInterviews() {
    try {
        const interviews = await sql<InterviewData>`
            SELECT 
                entry_id,
                date,
                company,
                position,  
                round,
                questionanswer,
                username,
                contactinfo 
            FROM interview
            WHERE approved = TRUE
            ORDER BY date DESC
        `;
        return interviews.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch approved interviews ');
    }
}

export async function fetchUnapprovedInterviews() {
    try {
        const interviews = await sql<InterviewDataAll>`
            SELECT 
                entry_id,
                date,
                company,
                position,  
                round,
                questionanswer,
                username,
                contactinfo, 
                approved, 
                approver
            FROM interview
            WHERE approved = False
            ORDER BY date DESC
        `;
        return interviews.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch unapproved interviews');
    }
}




//const ITEMS_PER_PAGE = 15;
export async function fetchFilteredInterviews(
    query:string,
    currentPage: number,
    ITEMS_PER_PAGE:number, 
) {
    const offset = (currentPage - 1)*ITEMS_PER_PAGE;
    
    console.log(offset)
    try {
        const interviews = await sql<InterviewData>`
         SELECT 
                date,
                company,
                position,  
                round,
                questionanswer,
                username,
                contactinfo 
            FROM interview
            WHERE 
                company ILIKE ${`%${query}%`}
                and approved = TRUE
            ORDER BY date DESC
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;
    return interviews.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch approved interviews.');
    }

}
export async function fetchTotalItems(): Promise<number> {
    try {
        const result = await sql<{ total_items: number }>`
            SELECT count(*) AS total_items
            FROM interview
        `;
        // Assuming the query always returns at least one row and one column named 'total_items'
        return result.rows[0].total_items;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total items');
    }
}

export async function fetchEmailPassword() {
    try {
        const data = await sql<User>`
            SELECT 
                distinct email, password
            FROM interview_users
        `;
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch email and passwords ');
    }
}