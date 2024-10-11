import axios from "../axios";
import { RequestStatus } from "@/models/Enum";

// #region Get all friend requests for the logged-in user.
export const Requests = async () => {
  return await axios.get("/friend-requests");
};
// #endregion

// #region Send a friend request to a user.
export const SendFriendRequest = async (email: string) => {
  const body = {
    email: email,
  };
  return await axios.post("/friend-requests", body);
};
// #endregion

// #region Update the status of a friendship request.
export const UpdateFriendshipRequest = async (
  senderEmail: string,
  status: RequestStatus
) => {
  const body = {
    email: senderEmail,
    status: status,
  };
  return await axios.patch("/friend-requests", body);
};
// #endregion
