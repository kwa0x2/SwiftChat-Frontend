import axios from "../axios";

// #region Check if a private room exists for a given friend's email.
export const checkAndGetPrivateRoom = async (friendEmail: string) => {
  const body = {
    email: friendEmail,
  };
  return await axios.post("/rooms/check", body);
};
// #endregion

// #region Retrieve the chat list history for the logged-in user.
export const getChatListHistory = async () => {
  return await axios.get("/rooms/chat-list");
};
// #endregion
