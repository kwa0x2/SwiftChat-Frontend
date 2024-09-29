"use client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SetStateAction, useEffect, useState } from "react";
import Sidebar from "./sidebar/sidebar";
import io, { Socket } from "socket.io-client";
import MainComponent from "@/app/(pages)/chat/main-component/page";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/app/redux/store";
import {
  updateChatListDeletedAtByEmail,
  setChatList,
  updateChatListFriendStatusByEmail,
  updateLastMessage,
} from "@/app/redux/slices/chatlistSlice";
import { getChatListHistory } from "@/app/api/services/room.Service";
import { toast } from "sonner";
import { ComingRequestsModel } from "./main-component/friends/requests-component/requests";
import { FriendsModel } from "./main-component/friends/friends-component/friends";
import { BlockedModel } from "./main-component/friends/blockeds-component/blocked";
import { ComingRequests } from "@/app/api/services/request.Service";
import { Blocked, Friends } from "@/app/api/services/friendship.Service";
import { Message } from "@/models/Message";
import { getChatHistoryByRoomId } from "@/app/api/services/message.Service";
import { updateMessageBoxDeletedAtByEmail, updateMessageBoxFriendStatusByEmail } from "@/app/redux/slices/messageBoxSlice";

const ChatPage = () => {
  const currentUser = useCurrentUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketUrl = process.env.SOCKET_IO_URL;
  const listMessages = useSelector(
    (state: RootState) => state.chatListReducer.messages
  );
  const dispatch = useDispatch<AppDispatch>();
  const [highlightedRoomId, setHighlightedRoomId] = useState<string | null>(
    null
  );
  const [requests, setRequests] = useState<ComingRequestsModel[]>([]);
  const [friends, setFriends] = useState<FriendsModel[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedModel[]>([]);
  const chatBoxValue = useAppSelector((state) => state.messageBoxReducer.value);
  const [messages, setMessages] = useState<Message[]>([]);

  const getChatListHistoryData = async () => {
    const res = await getChatListHistory();
    if (res.status === 200) {
      console.warn("chatlistnerw", res.data);
      dispatch(setChatList(res.data));
    }
  };

  useEffect(() => {
    const newSocket = io(socketUrl as string, {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("connected");
    });
    newSocket.on("disconnect", () => {
      console.log("disconnected");
    });
    newSocket.on("connect_error", (error) => {
      console.error(`Connection Error: ${error.message}`);
    });

    newSocket.emit("joinRoom", "notification");

    if (currentUser && currentUser.email) {
      getChatListHistoryData();
      getRequestData(),
        getFriendsData(),
        getBlockedUsersData(),
        newSocket.off(currentUser.email);

      newSocket.on(currentUser.email, (response: any) => {
        console.warn("new", response);
        if (response.action === "new_message") {
          let room_id = response.data.room_id;
          let message = response.data.message;
          let updatedAt = response.data.updatedAt;
          console.warn("listMessages", listMessages);

          if (listMessages) {
            getChatListHistoryData();
          }
          console.warn("listMessages", listMessages);

          dispatch(
            updateLastMessage({
              room_id,
              message,
              updatedAt,
            })
          );
          setHighlightedRoomId(response.data.room_id);
        } else if (response.action === "update_friendship_request") {

          if (response.data.status === "accepted") {
            setFriends((prevRequests) => {
              if (!Array.isArray(prevRequests)) {
                return [response.data.user_data];
              }
              return [...prevRequests, response.data.user_data];
            });
            dispatch(
              updateChatListFriendStatusByEmail({
                friend_status: "friend",
                user_email: response.data.user_data.friend_mail,
              })
            );
            dispatch(
              updateChatListDeletedAtByEmail({
                user_email: response.data.user_data.friend_mail,
                deletedAt: null
              })
            )
            dispatch(
              updateMessageBoxDeletedAtByEmail({
                user_email: response.data.user_data.friend_mail,
                deletedAt: null,
              })
            );
            dispatch(
              updateMessageBoxFriendStatusByEmail({
                friend_status: "friend",
                user_email: response.data.user_data.friend_mail,
              })
            );
            toast.success(
              `${response.data.user_data.user_name} is now your friend!`
            );
          } else if (response.data.status === "rejected") {
            toast.info(
              `${response.data.user_data.user_name} has rejected your friend request.`
            );
          }
        } else if (response.action === "friend_request") {
          setRequests((prevRequests) => {
            if (!Array.isArray(prevRequests)) {
              return [response.data];
            }
            return [...prevRequests, response.data];
          });
          toast.info(
            `${response.data.user_name} has sent you a friend request.`
          );
        } else if (response.action === "blocked_friend") {
          if (listMessages) {
            getChatListHistoryData();
          }

          let user_email = response.data.friend_mail;
          let friend_status = response.data.friend_status;

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

          setFriends((prevRequests) =>
            prevRequests.filter((req) => req.friend_mail !== user_email)
          );
        } else if (response.action === "deleted_friend") {
          setFriends((prevRequests) =>
            prevRequests.filter((req) => req.friend_mail !== response.data.user_email)
          );
          dispatch(updateChatListDeletedAtByEmail({
            user_email: response.data.user_email,
            deletedAt: new Date().toISOString()
          }))
          dispatch(updateMessageBoxDeletedAtByEmail({
            user_email: response.data.user_email,
            deletedAt: new Date().toISOString()
          }))
        }
      });
    }

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
        if (currentUser && currentUser.email) {
          newSocket.off(currentUser.email);
        }
      }
    };
  }, [socketUrl]);

  const getRequestData = async () => {
    const res = await ComingRequests();
    if (res.status == 200) {
      setRequests(res.data);
    } else {
      console.warn("ya arkadaşlık isteği yok yada hata var", res);
      toast.error(
        "An issue occurred while fetching friends. Please try again later."
      );
    }
  };

  const getFriendsData = async () => {
    const res = await Friends();
    if (res.status == 200) {
      setFriends(res.data);
    } else {
      toast.error(
        "An issue occurred while fetching friends. Please try again later."
      );
    }
  };

  const getBlockedUsersData = async () => {
    const res = await Blocked();

    if (res.status !== 200) {
      toast.error(
        "An unknown error occurred while retrieving blocked users. Please try again later."
      );
    } else {
      setBlockedUsers(res.data);
    }
  };

  return (
    <div
      className="h-screen w-screen p-6 flex gap-5 relative"
      style={{ zIndex: "1" }}
    >
      <Sidebar
        user={currentUser}
        highlightedRoomId={highlightedRoomId}
        setHighlightedRoomId={setHighlightedRoomId}
      />
      <MainComponent
        setBlockedUsers={setBlockedUsers}
        user={currentUser}
        socket={socket}
        setRequests={setRequests}
        setFriends={setFriends}
        requests={requests}
        friends={friends}
        blockedUsers={blockedUsers}
      />
    </div>
  );
};

export default ChatPage;
