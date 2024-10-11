import { updateChatListFriendStatusByEmail } from "@/app/redux/slices/chatListSlice";
import { updateChatFriendStatusByEmail } from "@/app/redux/slices/chatSlice";
import { AppDispatch } from "@/app/redux/store";

//#region Friend Status Update Handler
export const handleFriendStatusUpdate = (
  dispatch: AppDispatch,
  user_email: string,
  status: "blocked" | "unfriend" | "friend"
) => {
  dispatch(
    updateChatListFriendStatusByEmail({
      user_email,
      friend_status: status,
    })
  );

  dispatch(
    updateChatFriendStatusByEmail({
      user_email,
      friend_status: status,
    })
  );
};
//#endregion
