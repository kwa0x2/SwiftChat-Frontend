import axios from "../axios";

// #region Get all friends of the logged-in user.
export const Friends = async () => {
  return await axios.get("/friends");
};
// #endregion

// #region Get all blocked users of the logged-in user.
export const Blocked = async () => {
  return await axios.get("/friends/blocked");
};
// #endregion

// #region Block a user by their email.
export const Block = async (friendEmail: string) => {
  const body = {
    email: friendEmail,
  };
  return await axios.patch("/friends/block", body);
};
// #endregion

// #region Remove a friend by their email.
export const Remove = async (friendEmail: string) => {
  const body = {
    email: friendEmail,
  };
  return await axios.delete("/friends", {
    data: body,
  });
};
// #endregion
