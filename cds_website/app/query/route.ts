import { db } from "@vercel/postgres";
import { fetchTotalItems } from "../lib/data";

const client = await db.connect();

async function listInterviews() {

    // const data = await client.sql`
    // SELECT *
    // FROM interview
    // WHERE lower(company) like 'orange' -- must use single quotes
    
    // `;
    const data = await fetchTotalItems();
    //return data.rows;
    return data
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
