import { sql } from '@vercel/postgres'
import {
    InterviewData,
  
} from './definitions'
export async function fetchInterviews() {
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
            ORDER BY date ASC
        `;
        return interviews.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoices ');
    }
}

const ITEMS_PER_PAGE = 15;
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
            ORDER BY date ASC
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;
    return interviews.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoices.');
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