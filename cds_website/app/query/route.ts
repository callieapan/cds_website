import { db } from "@vercel/postgres";
import { interview_entry } from "../lib/placeholder_data";

const client = await db.connect();

async function listInterviews() {

    const data = await client.sql`
    SELECT *
    FROM interview
    `;

    return data.rows;
}

export async function GET() {
    try {
        return Response.json(await listInterviews());
    } catch (error) {
      return Response.json({ error }, { status: 500 })
    }
}