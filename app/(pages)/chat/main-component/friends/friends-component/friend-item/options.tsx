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
import { FriendModel } from "../friends";
import { toast } from "sonner";
import { checkAndGetPrivateRoom } from "@/app/api/services/room.Service";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import {
  ChatSliceModel,
  setChatData,
  updateChatFriendStatusByEmail,
} from "@/app/redux/slices/chatSlice";
import {
  addChatList,
  updateChatListFriendStatusByEmail,
} from "@/app/redux/slices/chatListSlice";
import { BlockedModel } from "../../blocked-component/blocked";
import { useCallback } from "react";
import { setActiveComponent, setFriendStatus } from "@/app/redux/slices/componentSlice";
import { Block, Remove } from "@/app/api/services/friendship.Service";

interface FriendOptionsProps {
  friend: FriendModel;
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedModel[]>>;
  setFriends: React.Dispatch<React.SetStateAction<FriendModel[]>>;
}

const Options = ({
  friend,
  setBlockedUsers,
  setFriends,
}: FriendOptionsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const chatLists = useSelector(
    (state: RootState) => state.chatListReducer.chatLists
  );

  const blockFriend = async () => {
    const res = await Block(friend.friend_mail);
    if (res.status === 200) {
      setFriends((prev) =>
        prev.filter((req) => req.friend_mail !== friend.friend_mail)
      );

      setBlockedUsers((prev) => [
        ...(Array.isArray(prev) ? prev : []),
        {
          blocked_mail: friend.friend_mail,
          user_name: friend.user_name,
        },
      ]);

      dispatch(
        updateChatListFriendStatusByEmail({
          friend_status: "blocked",
          user_email: friend.friend_mail,
        })
      );

      dispatch(
        updateChatFriendStatusByEmail({
          friend_status: "blocked",
          user_email: friend.friend_mail,
        })
      );
      toast.success(`${friend.user_name} has been successfully blocked.`);

    } else {
      toast.error(
        "An unknown error occurred while trying to block the user."
      );
    }
  };

  const deleteFriend = async () => {
    const res = await Remove(friend.friend_mail);
    if (res.status === 200) {
      setFriends((prev) =>
        prev.filter((req) => req.friend_mail !== friend.friend_mail)
      );
  
      dispatch(
        updateChatListFriendStatusByEmail({
          user_email: friend.friend_mail,
          friend_status: "unfriend",
        })
      );
      dispatch(
        updateChatFriendStatusByEmail({
          user_email: friend.friend_mail,
          friend_status: "unfriend",
        })
      );
      toast.success(`${friend.user_name} has been successfully deleted from your friends!`);
    } else {
      toast.error(
        "An unknown error occurred while trying to delete the friend."
      );
    }
  };
  

  const openChatHandler = useCallback(async () => {
    const res = await checkAndGetPrivateRoom(friend.friend_mail);
    if (res.status === 200) {
      const room_id = res.data.room_id;

      const chatDataObj: ChatSliceModel = {
        user_email: friend.friend_mail,
        user_name: friend.user_name,
        user_photo: friend.user_photo,
        friend_status: "friend",
        room_id,
        createdAt: new Date().toISOString(),
        activeStatus: friend.activeStatus,
      };

      if (chatLists) {
        const chatRoom = chatLists.find((msg) => msg.room_id === room_id);
        if (chatRoom) {
          dispatch(setChatData(chatDataObj));
        } else {
          dispatch(
            addChatList({
              room_id,
              last_message: "",
              updatedAt: new Date().toISOString(),
              user_name: friend.user_name,
              user_photo: friend.user_photo,
              user_email: friend.friend_mail,
              friend_status: "friend",
              createdAt: new Date().toISOString(),
              activeStatus: friend.activeStatus,
              last_message_id: ""
            })
          );
          dispatch(setChatData(chatDataObj));
        }
      } else {
        dispatch(
          addChatList({
            room_id,
            last_message: "",
            updatedAt: new Date().toISOString(),
            user_name: friend.user_name,
            user_photo: friend.user_photo,
            user_email: friend.friend_mail,
            friend_status: "friend",
            createdAt: new Date().toISOString(),
            activeStatus: friend.activeStatus,
            last_message_id: ""
          })
        );
        dispatch(setChatData(chatDataObj));
      }
      dispatch(setActiveComponent("chat"));
      dispatch(setFriendStatus("friend"));

    } else {
      toast.error(
        "An unknown error occurred while trying to open the chat box."
      );
    }
  }, [friend, chatLists, dispatch]);

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
