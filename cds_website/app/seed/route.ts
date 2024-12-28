//import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { interview_entry } from '../lib/placeholder_data';


const client = await db.connect();

async function seedInterview() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS interview (
      entry_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      
      email TEXT NOT NULL UNIQUE,
      date TEXT NOT NULL,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      round TEXT NOT NULL,
      otherRound VARCHAR(225),
      questionAnswer TEXT NOT NULL,
      userName VARCHAR(255),
      contactInfo VARCHAR(255)
      
    );
  `;

  const insertedInterview = await Promise.all(
    interview_entry.map(async (entry) => {
      //const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO interview (email, date, company, position, round, otherRound, questionAnswer, userName, contactInfo)
        VALUES (${entry.email}, ${entry.date}, ${entry.company}, ${entry.position}, 
                ${entry.round}, ${entry.otherRound}, ${entry.questionAnswer}, ${entry.userName}, ${entry.contactInfo})
        WHERE 
        ON CONFLICT (email, company, position ) DO NOTHING;
      `;
    }),
  );

  return insertedInterview;
}



export async function GET() {
  // return Response.json({
  //   message:
  //     'Uncomment this file and remove this line. You can delete this file when you are finished.',
  // });
  try {
    await client.sql`BEGIN`;
    await seedInterview();
    //await seedCustomers();
   // await seedInvoices();
    //await seedRevenue();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    console.error(error);  // Good for debugging
    return Response.json({ error }, { status: 500 });
  }
}
