import { db } from "@vercel/postgres";
import { fetchInterviews } from "../lib/data";
import { sendEmail } from "../lib/actions";

const client = await db.connect();

// async function listInterviews() {

//     // const data = await client.sql`
//     // SELECT *
//     // FROM interview
//     // WHERE lower(company) like 'orange' -- must use single quotes
    
//     // `;
//     const data = await fetchTotalItems();
//     //return data.rows;
//     return data
// }

async function listInterviewUsers() {

    const data = await client.sql`
    SELECT distinct email, password
    FROM interview_users
    WHERE email = 'cp2530@nyu.edu' 
    `;
     
    return data.rows[0]
    //return data
}


export async function GET() {
    try {
        //const results = await listInterviewUsers();
        //const results = await fetchInterviews();
        const results = await sendEmail("NYU alum", "calliea.pan@gmail.com", "nyucds2025")
        return Response.json(results);
    } catch (error) {
        console.error("Error fetching interviews:", error);
        if (error instanceof Error) {
            return Response.json({ error: error.message }, { status: 500 });
        }
        return Response.json({error: "An unknown error occured"}, { status: 500 })
    }
}
