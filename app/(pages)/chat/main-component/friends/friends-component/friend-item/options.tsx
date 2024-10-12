"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GoBlocked } from "react-icons/go";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { LuUserX } from "react-icons/lu";
import { toast } from "sonner";
import { checkAndGetPrivateRoom } from "@/app/api/services/room.Service";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import {
  ChatSliceModel,
  setChatData,
} from "@/app/redux/slices/chatSlice";
import {
  addChatList,
} from "@/app/redux/slices/chatListSlice";
import { useCallback } from "react";
import {
  setActiveComponent,
} from "@/app/redux/slices/componentSlice";
import { Block, Remove } from "@/app/api/services/friend.Service";
import { handleSocketEmit } from "@/lib/socket";
import { Socket } from "socket.io-client";
import { handleFriendStatusUpdate } from "@/lib/slice";
import { FriendModel } from "@/models/Friend";
import { BlockedModel } from "@/models/Blocked";

interface FriendOptionsProps {
  friend: FriendModel;
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedModel[]>>;
  setFriends: React.Dispatch<React.SetStateAction<FriendModel[]>>;
  socket: Socket | null;
}

const Options = ({
  friend,
  setBlockedUsers,
  setFriends,
  socket,
}: FriendOptionsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const chatLists = useSelector(
    (state: RootState) => state.chatListReducer.chatLists
  );

  // #region Blocking a Friend
  const blockFriend = async () => {
    const res = await Block(friend.friend_email);
    if (res.status === 200) {
      // Update state to reflect the blocked user
      setFriends((prev) =>
        prev.filter((req) => req.friend_email !== friend.friend_email)
      );
      setBlockedUsers((prev) => [
        ...(Array.isArray(prev) ? prev : []),
        {
          blocked_email: friend.friend_email,
          user_name: friend.user_name,
        },
      ]);

      handleFriendStatusUpdate(dispatch, friend.friend_email, "blocked");

      toast.success(`${friend.user_name} has been successfully blocked.`);
    } else {
      toast.error("An unknown error occurred while trying to block the user.");
    }
  };
  // #endregion

  // #region Deleting a Friend
  const deleteFriend = async () => {
    const res = await Remove(friend.friend_email);
    if (res.status === 200) {
      // Update state to remove the friend
      setFriends((prev) =>
        prev.filter((req) => req.friend_email !== friend.friend_email)
      );

      // Dispatch actions to update chat list and friend status
      handleFriendStatusUpdate(dispatch, friend.friend_email, "unfriend");
      toast.success(
        `${friend.user_name} has been successfully deleted from your friends!`
      );
    } else {
      toast.error(
        "An unknown error occurred while trying to delete the friend."
      );
    }
  };
  // #endregion

  // #region Opening a Chat
  const openChatHandler = useCallback(async () => {
    const res = await checkAndGetPrivateRoom(friend.friend_email);
    if (res.status === 200) {
      const room_id = res.data.room_id;

      const chatDataObj: ChatSliceModel = {
        user_email: friend.friend_email,
        user_name: friend.user_name,
        user_photo: friend.user_photo,
        friend_status: "friend",
        room_id,
        createdAt: new Date().toISOString(),
        activeStatus: friend.activeStatus,
      };

      // Check if the chat room already exists
      const chatRoom = chatLists?.find((msg) => msg.room_id === room_id);
      if (chatRoom) {
        dispatch(setChatData(chatDataObj));
        handleSocketEmit(
          socket,
          "readMessage",
          { room_id },
          "",
          () => {},
          () => {
            toast.error("An unknown error occurred. Please try again later.");
          }
        );
      } else {
        // If not, add a new chat room
        dispatch(
          addChatList({
            room_id,
            last_message_content: "",
            updatedAt: new Date().toISOString(),
            user_name: friend.user_name,
            user_photo: friend.user_photo,
            user_email: friend.friend_email,
            friend_status: "friend",
            createdAt: new Date().toISOString(),
            activeStatus: friend.activeStatus,
            last_message_id: "",
            message_type: "",
            highlight: false
          })
        );
        dispatch(setChatData(chatDataObj));
      }

      // Update active component and friend status
      dispatch(setActiveComponent("chat"));
    } else {
      toast.error(
        "An unknown error occurred while trying to open the chat box."
      );
    }
  }, [friend, chatLists, dispatch, socket]);
  // #endregion

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger onClick={blockFriend}>
          <GoBlocked className="text-rose-600 h-5 w-5 transition-all duration-500 opacity-70 hover:opacity-100" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Block</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger onClick={deleteFriend}>
          <LuUserX className="text-white h-5 w-5 transition-all duration-500 opacity-70 hover:opacity-100" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Remove Friend</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger onClick={openChatHandler}>
          <IoChatboxEllipsesOutline className="text-white transition-all duration-500 h-5 w-5 opacity-70 hover:opacity-100" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Send a message</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Options;
