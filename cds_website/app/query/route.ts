import { db } from "@vercel/postgres";


const client = await db.connect();

async function listInterviews() {

    const data = await client.sql`
    SELECT *
    FROM interview
    WHERE lower(company) like 'orange' -- must use single quotes
    
    `;

    return data.rows;
}

export async function GET() {
    try {
        const results = await listInterviews();
        return Response.json(results);
    } catch (error) {
        console.error("Error fetching interviews:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
