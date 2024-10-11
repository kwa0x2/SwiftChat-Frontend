"use server";

import { logoutServer } from "@/app/api/services/auth.Service";
import { cookies } from "next/dist/client/components/headers";
import { signOut } from "@/auth";

// #region User Logout Action

/*
 * This method handles user logout by first sending a logout request to the backend,
 * followed by calling the front-end auth.js methods to ensure a secure logout process.
 */
export const logoutAction = async () => {
  try {
    // Server-side logout request
    await logoutServer().then(async (res: any) => {
      if (res.status === 200) {
        /* Normally, the backend will delete the cookie, but since this request
         * is server-side, we need to manually delete the cookie here.
         */
        cookies().delete(process.env.SESSION_COOKIE_NAME || "connect.sid");
        // If the request is successful, initiate logout procedures in auth.js
        await signOut();
      }
    });
  } catch (error) {
    throw error;
  }
};
// #endregion
