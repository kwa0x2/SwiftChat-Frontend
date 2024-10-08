"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { SetStateAction, useEffect, useRef, useState } from "react";
import Sidebar from "./sidebar/sidebar";
import io, { Socket } from "socket.io-client";
import MainComponent from "@/app/(pages)/chat/main-component/page";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "@/app/redux/store";
import {
  deleteLastMessage,
  setChatList,
  updateChatListActiveStatusByEmails,
  updateChatListFriendStatusByEmail,
  updateChatListUsernameByEmail,
  updateChatListUserPhotoByEmail,
  updateLastMessage,
} from "@/app/redux/slices/chatListSlice";
import { getChatListHistory } from "@/app/api/services/room.Service";
import { toast } from "sonner";
import { RequestsModel } from "./main-component/friends/requests-component/requests";
import { FriendModel } from "./main-component/friends/friends-component/friends";
import { BlockedModel } from "./main-component/friends/blocked-component/blocked";
import { ComingRequests } from "@/app/api/services/request.Service";
import { Blocked, Friends } from "@/app/api/services/friendship.Service";
import {
  updateChatActiveStatusByEmails,
  updateChatFriendStatusByEmail,
  updateChatUsernameByEmail,
  updateChatUserPhotoByEmail,
} from "@/app/redux/slices/chatSlice";
import { handleSocketEmit } from "@/lib/socket";

const ChatPage = () => {
  const currentUser = useCurrentUser();
  const socketRef = useRef<Socket | null>(null);
  const socketUrl = process.env.SOCKET_IO_URL;
  const chatLists = useSelector(
    (state: RootState) => state.chatListReducer.chatLists
  );
  const componentReducerValue = useSelector(
    (state: RootState) => state.componentReducer
  );
  const componentReducerRef = useRef(componentReducerValue);
  const chatListsRef = useRef(chatLists);
  const onlineUsers = useRef<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [highlightedRoomId, setHighlightedRoomId] = useState<string | null>(
    null
  );
  const [requests, setRequests] = useState<RequestsModel[]>([]);
  const [friends, setFriends] = useState<FriendModel[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedModel[]>([]);

  const getChatListHistoryData = async () => {
    const res = await getChatListHistory();
    if (res.status === 200) {
      dispatch(setChatList(res.data.data));
      dispatch(
        updateChatListActiveStatusByEmails({
          activeEmails: onlineUsers.current,
        })
      );
      dispatch(
        updateChatActiveStatusByEmails({
          activeEmails: onlineUsers.current,
        })
      );
    }
  };

  useEffect(() => {
    componentReducerRef.current = componentReducerValue;
  }, [componentReducerValue]);

  useEffect(() => {
    chatListsRef.current = chatLists;
  }, [chatLists]);

  useEffect(() => {
    const newSocket = io(socketUrl as string, {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => console.log("connected "));
    newSocket.on("disconnect", () => console.log("disconnected"));
    newSocket.on("connect_error", (error) =>
      console.error(`Connection Error: ${error.message}`)
    );

    newSocket.emit("joinRoom", "notification");

    socketRef.current = newSocket;

    if (currentUser && currentUser.email) {
      getChatListHistoryData();
      getRequestData();
      getFriendsData();
      getBlockedUsersData();

      newSocket.on(currentUser.email, (response: any) =>
        handleSocketResponse(response)
      );

      newSocket.on("onlineUsers", (response: any) => {
        onlineUsers.current = response;
        dispatch(
          updateChatListActiveStatusByEmails({
            activeEmails: response,
          })
        );
        dispatch(
          updateChatActiveStatusByEmails({
            activeEmails: response,
          })
        );

        setFriends((prevFriends) =>
          prevFriends?.map((friend) =>
            response.includes(friend.friend_mail)
              ? { ...friend, activeStatus: true }
              : { ...friend, activeStatus: false }
          )
        );

        setRequests((prevRequests) =>
          prevRequests?.map((requests) =>
            response.includes(requests.sender_mail)
              ? { ...requests, activeStatus: true }
              : { ...requests, activeStatus: false }
          )
        );
      });
    }

    return () => {
      if (currentUser && currentUser.email) {
        newSocket.off(currentUser.email);
      }
    };
  }, [socketUrl, currentUser?.email]);

  const handleSocketResponse = (response: any) => {
    const { action, data } = response;
    // if (chatLists.length === 0) {
    //   getChatListHistoryData();
    // }
    if (action === "new_message") {
      handleNewMessage(data);
    } else if (action === "update_friendship_request") {
      handleFriendshipUpdate(data);
    } else if (action === "friend_request") {
      handleFriendRequest(data);
    } else if (action === "blocked_friend") {
      handleBlockedFriend(data);
    } else if (action === "deleted_friend") {
      handleDeletedFriend(data);
    } else if (action === "update_username") {
      handleUpdateUsername(data);
    } else if (action === "update_user_photo") {
      handleUpdateUserPhoto(data);
    } else if (action === "delete_message") {
      const { room_id, message_id } = data;

      dispatch(
        deleteLastMessage({
          room_id,
          message_id,
          updatedAt: new Date().toISOString(),
          deletedAt: new Date().toISOString(),
        })
      );
    }
  };

  const handleNewMessage = (data: any) => {
    const { room_id, message, message_id, updatedAt } = data;

    const roomExists = chatListsRef.current?.some(
      (chat) => chat.room_id === room_id
    );

    if (!roomExists) {
      getChatListHistoryData();
     
    }

    dispatch(
      updateLastMessage({
        room_id,
        message,
        message_id,
        updatedAt,
      })
    );
    if (componentReducerRef.current.activeComponent !== "chat") {
      setHighlightedRoomId(room_id);
    } else if (componentReducerRef.current.friendStatus === "friend") {
      handleSocketEmit(
        socketRef.current,
        "readMessage",
        { room_id, message_id },
        "",
        () => {
        },
        () => {
          toast.error("An unknown error occurred. Please try again later.");
        }
      );
    }
  };

  const handleFriendshipUpdate = (data: any) => {
    if (data.status === "accepted") {
      const updatedData = { ...data.user_data, activeStatus: true };

      setFriends((prev) =>
        Array.isArray(prev) ? [...prev, updatedData] : [updatedData]
      );
      dispatch(
        updateChatListFriendStatusByEmail({
          friend_status: "friend",
          user_email: data.user_data.friend_mail,
        })
      );
      dispatch(
        updateChatFriendStatusByEmail({
          friend_status: "friend",
          user_email: data.user_data.friend_mail,
        })
      );
      toast.info(`${data.user_data.user_name} is now your friend!`);
    }
  };

  const handleFriendRequest = (data: any) => {
    const updatedData = { ...data, activeStatus: true };

    setRequests((prev) => (Array.isArray(prev) ? [...prev, updatedData] : [updatedData]));
    toast.info(`${data.user_name} has sent you a friend request.`);
  };

  const handleBlockedFriend = (data: any) => {
    if (chatLists) getChatListHistoryData();
    const { friend_mail, friend_status } = data;
    dispatch(
      updateChatListFriendStatusByEmail({
        friend_status,
        user_email: friend_mail,
      })
    );
    dispatch(
      updateChatFriendStatusByEmail({
        friend_status,
        user_email: friend_mail,
      })
    );
    setFriends((prev) => prev.filter((req) => req.friend_mail !== friend_mail));
  };

  const handleDeletedFriend = (data: any) => {
    const { user_email } = data;
    setFriends((prev) => prev?.filter((req) => req.friend_mail !== user_email));
    dispatch(
      updateChatListFriendStatusByEmail({
        user_email,
        friend_status: "unfriend",
      })
    );
    dispatch(
      updateChatFriendStatusByEmail({
        user_email,
        friend_status: "unfriend",
      })
    );
  };

  const handleUpdateUsername = (data: any) => {
    const { updated_username, user_email } = data;
    dispatch(
      updateChatListUsernameByEmail({
        user_name: updated_username,
        user_email,
      })
    );
    dispatch(
      updateChatUsernameByEmail({
        user_name: updated_username,
        user_email,
      })
    );

    setFriends((prevFriends) =>
      prevFriends?.map((friend) =>
        friend.friend_mail === user_email
          ? { ...friend, user_name: updated_username }
          : friend
      )
    );

    setRequests((prevRequests) =>
      prevRequests?.map((request) =>
        request.sender_mail === user_email
          ? { ...request, user_name: updated_username }
          : request
      )
    );

    setBlockedUsers((prevBlockedUsers) =>
      prevBlockedUsers?.map((blockedUsers) =>
        blockedUsers.blocked_mail === user_email
          ? { ...blockedUsers, user_name: updated_username }
          : blockedUsers
      )
    );
  };

  const handleUpdateUserPhoto = (data: any) => {
    const { updated_user_photo, user_email } = data;
    dispatch(
      updateChatListUserPhotoByEmail({
        user_photo: updated_user_photo,
        user_email,
      })
    );
    dispatch(
      updateChatUserPhotoByEmail({
        user_photo: updated_user_photo,
        user_email,
      })
    );

    setFriends((prevFriends) =>
      prevFriends?.map((friend) =>
        friend.friend_mail === user_email
          ? { ...friend, user_photo: updated_user_photo }
          : friend
      )
    );

    setRequests((prevRequests) =>
      prevRequests?.map((request) =>
        request.sender_mail === user_email
          ? { ...request, user_photo: updated_user_photo }
          : request
      )
    );
  };

  const getRequestData = async () => {
    const res = await ComingRequests();
    if (res.status === 200) {
      setRequests(res.data.data);
    } else {
      toast.error(
        "An issue occurred while fetching friends. Please try again later."
      );
    }
  };

  const getFriendsData = async () => {
    const res = await Friends();
    if (res.status === 200) {
      setFriends(res.data.data);
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
      setBlockedUsers(res.data.data);
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
        onlineUsers={onlineUsers.current}
        socket={socketRef.current}
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
