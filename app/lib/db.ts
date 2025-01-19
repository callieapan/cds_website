// use pg for sql instead of vercel/postgre

import { Pool } from 'pg';
const pool = new Pool({
    user: process.env.PGUSER,// dbCredentials.username,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
  });


export async function queryDatabase(query: string, params: any[] = []) {
   
    const client = await pool.connect();
    try {
      const result = await client.query(query, params);
      //console.log(result)
       
      if (result.command === 'UPDATE' || result.command === 'INSERT' || result.command === 'DELETE'){
        // for select count (...)
        //console.log("in if")
         // for UPDATE/INSERT/DELETE), return the rowCount
        return result.rowCount; //only returning rowcount now

      }
      //console.log("in else")
      //console.log(result.rows[0].count)
      return result.rows[0].count
     
    } finally {
      client.release(); // Always release the client back to the pool
    }
  };

// generic type version to ensure type safety

export async function queryDatabaseTypeSafe<T = void>(
    query: string,
    params: any[]
  ): Promise<T extends void ? number : T[]> {

    // for SELECTs, return the array of rows that follow the type in T
    const client = await pool.connect();

    try {
        const result = await client.query(query, params);
    
        // // If T is void (e.g., for UPDATE/INSERT/DELETE), return the rowCount
        
        // if (result.rowCount !== null && result.rowCount !== undefined) {
        // return result.rowCount as T extends void ? number : T[];
        // }
    
        // If T is not void (e.g., for SELECT), return the rows
        //console.log(result)
        return result.rows as T extends void ? number : T[];
    } finally {
        client.release(); // Always release the client back to the pool
    }
  };