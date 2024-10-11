import NextAuth, { DefaultSession } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import { getLoggedInUserServer } from "@/app/api/services/auth.Service";
import { cookies } from "next/dist/client/components/headers";



//#region EXTENDED USER
export type ExtendedUser = DefaultSession["user"] & {
  name: any;
  photo: any;
};
declare module "next-auth" {
  interface Session {
    user: ExtendedUser; 
  }
}
//#endregion

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async session({ token, session }) {
      /* If the user is logged in, the token will have a 'sub' field,
       * and the session will include the user object.
       */
      if (token.sub && session.user) {
        // Set user details from token to session for frontend access
        session.user.name = token.username || session.user.name;
        session.user.photo = token.photo || session.user.photo;

        session.user.id = token.sub; // Assign user ID from token
      }


      return session; // Return updated session
    },
    async jwt({ token }) {
      /* This authorization code runs every time the user changes pages,
       * ensuring that the user's permissions are updated continuously.
       */

      // Check if user ID exists in the token
      if (!token.sub) return token;

      const existingUser = await getLoggedInUserServer(); // Fetch user info
      if (!existingUser.email) {
        cookies().delete(process.env.SESSION_COOKIE_NAME || "connect.sid"); // Delete cookie if no email
        await signOut(); // Sign out user
      }

            // Update token with existing user information
      if (existingUser && existingUser.name && existingUser.photo) {
        token.name = existingUser.name; 
        token.photo = existingUser.photo;
      }

      return token; // Return updated token
    },
  },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        return {
          id: credentials.id as string,
          name: credentials.name as string,
          email: credentials.email as string,
          photo: credentials.photo as string,
        };
      },
    }),
  ],
});
