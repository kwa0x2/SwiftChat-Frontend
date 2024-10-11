import { getMyCookie } from "@/hooks/get-my-cookie";
import axios from "../axios";

// #region Sign up a new user.
export const signup = async (
  token: string,
  userName: string,
  userPhoto: string
) => {
  return await axios.post(
    "/auth/signup",
    { user_name: userName, user_photo: userPhoto },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};
//#endregion

// #region Log out the user on the server side.
export const logoutServer = async () => {
  const query = await fetch(`${process.env.BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      Cookie: `${getMyCookie()}`,
    },
  });
  const response = {
    status: query.status,
    statusText: query.statusText,
    headers: query.headers,
  };
  return response;
};
//#endregion

// #region Check if the user has a valid session on the server side.
export const getLoggedInUserServer = async () => {
  const query = await fetch(`${process.env.BASE_URL}/auth/status`, {
    headers: {
      Cookie: `${getMyCookie()}`,
    },
  });
  const response = await query.json();
  return response;
};
//#endregion

// #region Check if the user has a valid session on the client side.
export const getLoggedInUser = async () => {
  return await axios.get("/auth/status");
};
//#endregion
