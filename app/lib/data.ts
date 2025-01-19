import {
    InterviewData,
    InterviewDataAll,
    User
  
} from './definitions'
import { queryDatabase, queryDatabaseTypeSafe } from '../lib/db';
//import { Inter } from 'next/font/google';



export async function fetchInterviews():Promise<InterviewData[]> {
    try {
        // const interviews = await sql<InterviewData>`
        //     SELECT 
        //         entry_id,
        //         date,
        //         company,
        //         position,  
        //         round,
        //         questionanswer,
        //         username,
        //         contactinfo 
        //     FROM interview
        //     WHERE approved = TRUE
        //     ORDER BY date DESC
        // `;

        const query = `
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

        const interviews = await queryDatabaseTypeSafe<InterviewData>(query, []);

        //return interviews.rows as InterviewData[];
        return interviews
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch approved interviews ');
    }
}

export async function fetchUnapprovedInterviews():Promise<InterviewDataAll[]> {
    try {
        // const interviews = await sql<InterviewDataAll>`
        //     SELECT 
        //         entry_id,
        //         email,
        //         date,
        //         company,
        //         position,  
        //         round,
        //         questionanswer,
        //         username,
        //         contactinfo, 
        //         approved, 
        //         approver
        //     FROM interview
        //     WHERE approved = False
        //     ORDER BY date DESC
        // `;

        const query = `
            SELECT 
                entry_id,
                email,
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
        const interviews = await queryDatabaseTypeSafe<InterviewDataAll>(query, [])

        //return interviews.rows as InterviewDataAll[];
        return interviews
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch unapproved interviews');
    }
}



export async function fetchFilteredInterviews(
    query:string,
    currentPage: number,
    ITEMS_PER_PAGE:number, 
) : Promise<InterviewData[]> {
    const offset = (currentPage - 1)*ITEMS_PER_PAGE;
    
    console.log(offset)
    try {
        // const interviews = await sql<InterviewData>`
        //  SELECT 
        //         date,
        //         company,
        //         position,  
        //         round,
        //         questionanswer,
        //         username,
        //         contactinfo 
        //     FROM interview
        //     WHERE 
        //         company ILIKE ${`%${query}%`}
        //         and approved = TRUE
        //     ORDER BY date DESC
        //     LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        // `;

        const query_ = `
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
            WHERE 
                approved = TRUE
                and company ILIKE $3
            ORDER BY date DESC
            LIMIT $1 OFFSET $2
        `;

        const queryParam = [
           
            ITEMS_PER_PAGE,
            offset,
            `%`+query+`%`, 
        ]
        const interviews = await queryDatabaseTypeSafe<InterviewData>(query_, queryParam);
        return interviews;
    //return interviews.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch approved interviews.');
    }

}
export async function fetchTotalApprovedItems(): Promise<number> {
    try {
        // const result = await sql<{ total_items: number }>`
        //     SELECT count(*) AS total_items
        //     FROM interview
        // `;
        const query = `
            SELECT count(*)
            FROM interview
            WHERE approved = True
        `;
        const result = queryDatabase(query, []);
        // Assuming the query always returns at least one row and one column named 'total_items'
        //return result.rows[0].total_items;
        // console.log("result2")
        // console.log(result) 
        return result;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total items');
    }
}

export async function fetchEmailPassword() {
    try {
        // const data = await sql<User>`
        //     SELECT 
        //         distinct email, password
        //     FROM interview_users
        // `;
        const query = `
            SELECT 
                distinct email, password
            FROM interview_users
        `;
        const result = await queryDatabaseTypeSafe<User>(query, []);
        return result
        //return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch email and passwords ');
    }
}

 