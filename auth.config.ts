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
        // return Response.redirect(new URL('/interviews_table', nextUrl)); // this line mreans you will always redirect a logged in user to /interviews_table/xxyy
      //}
      
      // Allow access to other pages
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;