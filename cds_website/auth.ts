import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { EmailPassword, User } from '@/app/lib/definitions';
//import { fetchEmailPassword } from '@/app/lib/data';
import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';


async function getUser(email: string): Promise<EmailPassword | undefined> {
  try {
    const user = await sql<EmailPassword>`SELECT distinct email, password FROM interview_users WHERE email=${email}`;

    if (user.rows.length === 0) {
        console.log('No user found with email:', email);}

    console.log('email:', email, 
        'query:', `SELECT distinct email, password FROM users WHERE email='cp2530@nyu.edu'`,
        'Fetched user:', user); // Log the fetched user
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email); 
          if (!user) return null;
          
          const passwordsMatch = await bcrypt.compare(password, user.password);  

          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});