import axios from "../axios";

// #region Retrieve the message history for a specific room by its ID.
export const getMessageHistoryByRoomId = async (room_id: string) => {
  const body = {
    room_id: room_id,
  };
  return await axios.post("/messages/history", body);
};
// #endregion
