//import { db } from "@vercel/postgres";
import { sql } from '@vercel/postgres';
///import { fetchInterviews } from "../lib/data";
//import { approveInterview, sendEmail } from "../lib/actions";

//const client = await db.connect();


// async function listInterviewUsers() {

//     const data = await sql`
//     SELECT distinct email, password
//     FROM interview_users
//     WHERE email = 'cp2530@nyu.edu' 
//     `;
     
//     return data.rows[0]
//     //return data
// }

async function testApproveInterview() {
    const mySet = new Set(['77af5e6f-60b7-4812-8985-8300b20538f9', 'b4b432cc-5ba7-492d-a1eb-e6b64a89698f']);
    const ids: string[] = Array.from(mySet);
    const data = await sql`
        SELECT entry_id, company, position, round, date, approved, approver    
        FROM interview
        WHERE entry_id::text = ANY(${ids})
    `

    return data
    
}


export async function GET() {
    try {

        const results = await testApproveInterview();
        return Response.json(results);
    
    } catch (error) {
        console.error("Error approving interviews:", error);
        if (error instanceof Error) {
            return Response.json({ error: error.message }, { status: 500 });
        }
        return Response.json({error: "An unknown error occured"}, { status: 500 })
    }
}
