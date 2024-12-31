import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnInterviewTable = nextUrl.pathname.startsWith('/interviews_table');
      if (isOnInterviewTable) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } 
        // else if (isLoggedIn) {
        // return Response.redirect(new URL('/interviews_table', nextUrl));
      //}
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;