import { auth } from "@/auth";

import { DEFAULT_LOGIN_REDIRECT, authRoutes, publicRoutes } from "./routes";
import { NextResponse } from "next/server";

//#region Middleware Function for Authentication and Routing
export default auth((req) => {
  const { nextUrl } = req;

  // Check if the user is logged in (true if req.auth is present)
  const isLoggedIn = !!req.auth;

  // Check if the requested route is an authenticated route
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Check if the requested route is a public route
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  /* Allow users to stay on authentication routes (e.g., create name or error page)
   * without redirecting them. If they are on an auth route, let them proceed. */
  if (isAuthRoute) return NextResponse.next();

  /*
   * If the user is on a public route and is logged in, redirect them to the default login page
   * (e.g., chat page). If not logged in, allow them to continue on the public route.
   */
  if (isPublicRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // If the user is on an auth route but is logged in, redirect them to the default login page
  if (isAuthRoute) {
    if (isLoggedIn)
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    return NextResponse.next();
  }

  // If the user is not logged in and is not on a public route, redirect to the homepage
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/", nextUrl));
  }

  // If none of the above conditions are met, allow the request to continue
  return NextResponse.next();
});
//#endregion

//#region Middleware Configuration
// Optionally, specify routes to ignore for middleware
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
//#endregion
