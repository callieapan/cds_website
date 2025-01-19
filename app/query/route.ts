//import { db } from "@vercel/postgres";
//import { sql } from '@vercel/postgres';
///import { fetchInterviews } from "../lib/data";
//import { fetchInterviews, approveInterview, sendEmail } from "../lib/actions";
import { queryDatabase } from '../lib/db'; //queryDatabase,queryDatabaseTypeSafe,
//import { InterviewDataAll } from '../lib/definitions';

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

// async function testApproveInterview() {
//     const mySet = new Set(['77af5e6f-60b7-4812-8985-8300b20538f9', 'b4b432cc-5ba7-492d-a1eb-e6b64a89698f']);
//     //const ids: string[] = Array.from(mySet); //WHERE entry_id::text = ANY(${ids})
//     const ids = Array.from(mySet);
//     //const idstr = ids.map(name_=>`'${name_}'`).join(',');
//     console.log(ids);
  
//     // const data = await sql`
//     //     SELECT entry_id, company, position, round, date, approved, approver    
//     //     FROM interview
//     //     WHERE entry_id::text in ${idstr}
//     // `

//     const data = await sql`
//     SELECT entry_id, company, position, round, date, approved, approver    
//     FROM interview
//     WHERE entry_id = ANY (${sql.join(ids, 'uuid')})
//     `;

//     //console.log(data)
//     return data
    
// }


// async function testApprovers() {
//     const approvers = new Set(['Calliea Pan', 'Sarath Kareti']);
//     const names = Array.from(approvers); //WHERE approver = ANY(${names}::text[])
//     const nameslist = names.map(name_=>`'${name_}'`).join(',');
//     // Log the query parameters for debugging
//     console.log('namelist:', nameslist);

//     const data = await sql`
//         SELECT entry_id, company, position, round, date, approved, approver    
//         FROM interview
//         WHERE approver in (${nameslist})
//     `;

//     return data;
// }

// async function testApprovers(){
//     const idSet = new Set(['77af5e6f-60b7-4812-8985-8300b20538f9', 'b4b432cc-5ba7-492d-a1eb-e6b64a89698f']);
//     const approvers = new Set(['Calliea Pan', 'Sarath Kareti']);
//     //Convert the Set to an array
//     const idArray = Array.from(idSet);
//     const approversArray = Array.from(approvers);

//     // Construct the query with a dynamic IN clause
//     //const placeholders = approversArray.map((_, index) => `$${index + 1}`).join(', ');
//     const placeholders = idArray.map((_, index) =>`$${index + 1}`).join(', '); 
//     console.log(placeholders)
//     const query = `
//         SELECT entry_id, email, date, company, position, round, questionanswer,username, contactinfo, approved, approver
//         FROM interview
//         WHERE entry_id::text IN (${placeholders})
//     `;


//     // Execute the query
//     const data = await queryDatabaseTypeSafe<InterviewDataAll>(query, idArray);

//     return data; // data.rows Return the rows from the query result
// }

async function getTotItem (){
    const query = `
            SELECT count(*) 
            FROM interview
        `;
    const result = queryDatabase(query, []);
    return result
}

// async function testUpdate() {
//     const query = `
//         UPDATE interview
//         SET approved = TRUE, approver = 'Calliea Pan'
//         WHERE entry_id::text in ('77af5e6f-60b7-4812-8985-8300b20538f9')
//       `
//     const result = queryDatabase(query, []);
//     return result
// }

export async function GET() {
    try {

        //const results = await testApproveInterview();
        //const results = await testApprovers();
        const results = getTotItem();
        //const results = testUpdate();
        return Response.json(results);
    
    } catch (error) {
        console.error("Error approving interviews:", error);
        if (error instanceof Error) {
            return Response.json({ error: error.message }, { status: 500 });
        }
        return Response.json({error: "An unknown error occured"}, { status: 500 })
    }
}
