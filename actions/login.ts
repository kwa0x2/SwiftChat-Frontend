"use server";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

// #region User Login Action

/*
 * This method ensures that when the signIn function is called from the client side,
 * the user middleware is checked properly. Even if the user is logged in, they appear
 * as not logged in due to middleware checks. This method allows the user to log in,
 * create a session, and then pass through the middleware checks, allowing them to be
 * redirected to the chat page seamlessly.
 */
export const loginAction = async (
  id: string,
  name: string,
  email: string,
  photo: string
) => {
  await signIn("credentials", {
    id,
    name,
    email,
    photo,
    redirectTo: DEFAULT_LOGIN_REDIRECT,
  });
};
// #endregion
