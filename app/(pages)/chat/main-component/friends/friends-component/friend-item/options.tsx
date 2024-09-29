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
import { openChatBox, updateMessageBoxDeletedAtByEmail, updateMessageBoxFriendStatusByEmail } from "@/app/redux/slices/messageBoxSlice";
import { addChatList, updateChatListDeletedAtByEmail, updateChatListFriendStatusByEmail } from "@/app/redux/slices/chatlistSlice";
import io, { Socket } from "socket.io-client";
import { BlockedModel } from "../../blockeds-component/blocked";

interface FriendsProps {
  friends: FriendsModel;
  socket: Socket | null;
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedModel[]>>;
  setFriends: React.Dispatch<React.SetStateAction<FriendsModel[]>>;

}

const Options = ({ friends, socket, setBlockedUsers,setFriends }: FriendsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const chatLists = useSelector(
    (state: RootState) => state.chatListReducer.messages
  );

  const block = async (friend: FriendsModel) => {
    if (socket) {
      let friend_mail= friend.friend_mail
      let friend_name= friend.user_name

      socket.emit(
        "blockFriend",
        {
          friend_mail,
          friend_name,
        },
        (response: any) => {
          console.warn(response);
          if (response.status === "error") {
            toast.error(
              "An unknown error occurred while trying to block the user."
            );
          } else if (response.status === "success") {
            toast.success(`${friend_name} has been successfully blocked.`);
            setFriends((prevRequests) =>
              prevRequests.filter((req) => req.friend_mail !== friend_mail)
            );

            const newBlockedUser: BlockedModel = {
              blocked_mail: friend_mail,
              user_name: friend_name,
            };

            setBlockedUsers((prevRequests) => {
              if (!Array.isArray(prevRequests)) {
                return [newBlockedUser];
              }
              return [...prevRequests, newBlockedUser];
            });


            let user_email = friend_mail
            let friend_status = response.friend_status
  
            dispatch(
              updateChatListFriendStatusByEmail({
                friend_status,
                user_email,
              })
            );
  
            dispatch(
              updateMessageBoxFriendStatusByEmail({
                friend_status,
                user_email,
              })
            );
          }
        }
      );
    }
  };

  const removeFriend = async (friend: FriendsModel) => {
    if (socket) {
      let user_mail= friend.friend_mail
      let user_name= friend.user_name


      socket.emit(
        "deleteFriend",
        {
          user_mail,
          user_name,
        },
        (response: any) => {
          console.warn(response);
          if (response.status === "error") {
            toast.error(
              "An unknown error occurred while trying to remove the friend."
            );
          } else if (response.status === "success") {
            setFriends((prevRequests) =>
              prevRequests.filter((req) => req.friend_mail !== user_mail)
            );
            dispatch(updateChatListDeletedAtByEmail({
              user_email: user_mail,
              deletedAt: new Date().toISOString()
            }))
            dispatch(updateMessageBoxDeletedAtByEmail({
              user_email: user_mail,
              deletedAt: new Date().toISOString()
            }))
            toast.success(`${user_name} has been removed from friends!`);
          }
        }
      );
    }
  };

  const openChatBoxHandler = async (friendMail: string) => {
    let openChatBoxObj = {
      activeComponent: "chatbox",
      other_user_email: friendMail,
      other_user_name: friends.user_name,
      other_user_photo: friends.user_photo,
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
        } else {
          dispatch(
            addChatList({
              room_id: res.data.room_id,
              last_message: "",
              updatedAt: new Date().toISOString(),
              user_name: friends.user_name,
              user_photo: friends.user_photo,
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
            user_name: friends.user_name,
            user_photo: friends.user_photo,
            user_email: friendMail,
            friend_status: "friend",
          })
        );
        dispatch(openChatBox(openChatBoxObj));
      }
    } else {
      toast.error(
        "An unknown error occurred while trying to open the chat box."
      );
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <GoBlocked
              onClick={() => block(friends)}
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
              onClick={() => removeFriend(friends)}
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
              onClick={() => openChatBoxHandler(friends.friend_mail)}
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
