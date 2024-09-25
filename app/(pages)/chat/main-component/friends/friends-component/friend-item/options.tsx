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
import { FriendsModel } from "../friends";
import { Block, Remove } from "@/app/api/services/friendship.Service";
import { toast } from "sonner";
import {
  checkAndGetPrivateRoom,
  createPrivateRoom,
} from "@/app/api/services/room.Service";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { openChatBox } from "@/app/redux/slices/messageBoxSlice";
import { addChatList } from "@/app/redux/slices/chatlistSlice";

interface FriendsProps {
  friend: FriendsModel;
}

const Options: React.FC<FriendsProps> = ({ friend }) => {
  const dispatch = useDispatch<AppDispatch>();
  const chatLists = useSelector(
    (state: RootState) => state.chatListReducer.messages
  );

  const block = async (friendMail: string, friendName: string) => {
    const res = await Block(friendMail);
    if (res.status === 200) {
      toast.success(`${friendName} has been successfully blocked.`);
    } else {
      toast.error("An unknown error occurred while trying to block the user.");
    }
  };
  
  const removeFriend = async (friendMail: string, friendName: string) => {
    const res = await Remove(friendMail);
    if (res.status === 204) {
      toast.success(`${friendName} has been removed from friends!`);
    } else {
      toast.error("An unknown error occurred while trying to remove the friend.");
    }
  };
  

  const openChatBoxHandler = async (friendMail: string) => {
    let openChatBoxObj = {
      activeComponent: "chatbox",
      other_user_email: friendMail,
      other_user_name: friend.user_name,
      other_user_photo: friend.user_photo,
      friend_status: "friend",
      room_id: "",
    };

    const res = await checkAndGetPrivateRoom(friendMail);
    if (res.status === 200) {
      openChatBoxObj.room_id = res.data.room_id;
      if (chatLists) {
        const chatRoom = chatLists.find(
          (msg) => msg.room_id === res.data.room_id
        );
        if (chatRoom) {
          dispatch(openChatBox(openChatBoxObj));
        }else {
          dispatch(
            addChatList({
              room_id: res.data.room_id,
              last_message: "",
              updatedAt: new Date().toISOString(),
              user_name: friend.user_name,
              user_photo: friend.user_photo,
              user_email: friendMail,
              friend_status: "friend",
            })
          );
          dispatch(openChatBox(openChatBoxObj));
        }
      } else {
        dispatch(
          addChatList({
            room_id: res.data.room_id,
            last_message: "",
            updatedAt: new Date().toISOString(),
            user_name: friend.user_name,
            user_photo: friend.user_photo,
            user_email: friendMail,
            friend_status: "friend",
          })
        );
        dispatch(openChatBox(openChatBoxObj));
      }
    } else {
      toast.error("An unknown error occurred while trying to open the chat box.");
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <GoBlocked
              onClick={() => block(friend.friend_mail, friend.user_name)}
              className="text-rose-600 h-5 w-5 transition-all duration-500   opacity-70 hover:opacity-100"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Block</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <LuUserX
              onClick={() => removeFriend(friend.friend_mail, friend.user_name)}
              className="text-white h-5 w-5 transition-all duration-500   opacity-70 hover:opacity-100"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Remove Friend</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <IoChatboxEllipsesOutline
              onClick={() => openChatBoxHandler(friend.friend_mail)}
              className="text-white transition-all duration-500 h-5 w-5  opacity-70 hover:opacity-100"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Send a message</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default Options;
