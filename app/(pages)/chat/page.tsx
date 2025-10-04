"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { SetStateAction, useEffect, useRef, useState } from "react";
import Sidebar from "./sidebar/sidebar";
import io, { Socket } from "socket.io-client";
import MainComponent from "@/app/(pages)/chat/main-component";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import {
  deleteLastMessage,
  setChatList,
  updateChatListActiveStatusByEmails,
  updateChatListHighlightByRoomId,
  updateChatListUsernameByEmail,
  updateChatListUserPhotoByEmail,
  updateLastMessage,
} from "@/app/redux/slices/chatListSlice";
import { getChatListHistory } from "@/app/api/services/room.Service";
import { toast } from "sonner";

import { Requests } from "@/app/api/services/request.Service";
import { Blocked, Friends } from "@/app/api/services/friend.Service";
import {
  updateChatActiveStatusByEmails,
  updateChatUsernameByEmail,
  updateChatUserPhotoByEmail,
} from "@/app/redux/slices/chatSlice";
import { handleSocketEmit } from "@/lib/socket";
import { handleFriendStatusUpdate } from "@/lib/slice";
import { RequestsModel } from "@/models/Request";
import { BlockedModel } from "@/models/Blocked";
import { FriendModel } from "@/models/Friend";

const ChatPage = () => {
  // #region User and Socket Initialization

  // Get the current user from a custom hook
  const currentUser = useCurrentUser();
  // Create a reference for the socket connection
  const socketRef = useRef<Socket | null>(null);
  // Get the socket URL from environment variables
  const socketUrl = process.env.SOCKET_IO_URL;
  // Get the Redux dispatch function
  const dispatch = useDispatch<AppDispatch>();

  // #endregion

  // #region Redux Selectors and Refs

  // Select the chat lists from the Redux store
  const chatLists = useSelector(
    (state: RootState) => state.chatListReducer.chatLists
  );
  // Select the component reducer state from the Redux store
  const chatReducerValue = useSelector(
    (state: RootState) => state.chatReducer.value
  );
  // Select the component reducer state from the Redux store
  const componentReducerValue = useSelector(
    (state: RootState) => state.componentReducer
  );
  // Create refs to keep track of the component reducer and chat lists
  const chatListsRef = useRef(chatLists);
  const chatReducerRef = useRef(chatReducerValue);
  const componentReducerRef = useRef(componentReducerValue);
  // Create a ref for online users
  const onlineUsers = useRef<string[]>([]);

  // #endregion

  // #region Local State Initialization

  // Local state to manage highlighted room, friend requests, friends, blocked users, and chat list visibility
  const [requests, setRequests] = useState<RequestsModel[]>([]);
  const [friends, setFriends] = useState<FriendModel[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedModel[]>([]);
  const [isOpenChatList, setIsOpenChatList] = useState(false);
  const isOpenChatListRef = useRef(isOpenChatList);

  // #endregion

  // Update the reference of chat reducer value when it changes
  useEffect(() => {
    chatReducerRef.current = chatReducerValue;
  }, [chatReducerValue]);

  // Update the reference of chat lists when it changes
  useEffect(() => {
    chatListsRef.current = chatLists;
  }, [chatLists]);

  // Update the reference of component reducer when it changes
  useEffect(() => {
    componentReducerRef.current = componentReducerValue;
  }, [componentReducerValue]);

  // Update the reference of chat list visibility when it changes
  useEffect(() => {
    isOpenChatListRef.current = isOpenChatList;
  }, [isOpenChatList]);
  // #region API Calls

  // Fetch chat list history from the API
  const getChatListHistoryData = async () => {
    const res = await getChatListHistory();
    if (res.status === 200) {
      dispatch(setChatList(res.data.data));
      updateActiveUsersStatus();
    }
  };

  // Fetch incoming friend requests from the API
  const getRequestData = async () => {
    const res = await Requests();
    if (res.status === 200) setRequests(res.data.data);
    else toast.error("Failed to fetch friend requests.");
  };

  // Fetch friends data from the API
  const getFriendsData = async () => {
    const res = await Friends();
    if (res.status === 200) setFriends(res.data.data);
    else toast.error("Failed to fetch friends.");
  };

  // Fetch blocked users data from the API
  const getBlockedUsersData = async () => {
    const res = await Blocked();
    if (res.status === 200) setBlockedUsers(res.data.data);
    else toast.error("Failed to fetch blocked users.");
  };

  // #endregion

  // #region Socket Initialization and Event Handling

  // useEffect to manage socket connection and setup listeners
  useEffect(() => {
    // Create a new socket connection
    const newSocket = io(socketUrl as string, {
      transports: ["websocket", "polling"], // Specify transport methods
    });

    // Log when the socket connects
    newSocket.on("connect", () => console.log("connected"));
    // Log when the socket disconnects
    newSocket.on("disconnect", () => console.log("disconnected"));
    // Log any connection errors
    newSocket.on("connect_error", (error) =>
      console.error(`Connection Error: ${error.message}`)
    );

    // Emit a joinRoom event to the "notification" room
    newSocket.emit("joinRoom", "notification");

    // Store the socket reference
    socketRef.current = newSocket;

    // Fetch initial data and setup socket listeners if user email is available
    if (currentUser?.email) {
      fetchInitialData();
      setupSocketListeners(newSocket, currentUser.email);
    }

    // Cleanup function to remove socket listeners on component unmount
    return () => {
      if (currentUser?.email) newSocket.off(currentUser.email);
    };
  }, [socketUrl, currentUser?.email]);

  // #endregion

  // #region Socket Listener Setup

  // Function to setup socket listeners for specific events
  const setupSocketListeners = (socket: Socket, email: string) => {
    // Listen for responses associated with the user's email
    socket.on(email, (response: any) => handleSocketResponse(response));
    // Listen for updates on online users
    socket.on("onlineUsers", (response: any) =>
      handleOnlineUsersUpdate(response)
    );
  };

  // #endregion

  // #region Socket Response Handling

  // Function to handle incoming socket responses
  const handleSocketResponse = (response: any) => {
    const { action, data } = response; // Destructure action and data from the response
    switch (action) {
      case "new_message":
        handleNewMessage(data); // Handle new message event
        break;
      case "update_friendship_request":
        handleFriendshipUpdate(data); // Handle friendship update event
        break;
      case "friend_request":
        handleFriendRequest(data); // Handle friend request event
        break;
      case "blocked_friend":
        handleBlockedFriend(data); // Handle blocked friend event
        break;
      case "deleted_friend":
        handleDeletedFriend(data); // Handle deleted friend event
        break;
      case "update_username":
        handleUpdateUsername(data); // Handle username update event
        break;
      case "update_user_photo":
        handleUpdateUserPhoto(data); // Handle user photo update event
        break;
      case "delete_message":
        handleDeleteMessage(data); // Handle message deletion event
        break;
      default:
        break; // No action needed for unknown events
    }
  };

  // #endregion

  // #region Online Users Update Handling

  // Function to handle updates on online users
  const handleOnlineUsersUpdate = (response: any) => {
    onlineUsers.current = response; // Update the list of online users
    updateActiveUsersStatus(); // Update the active status of users in chat
    updateFriendsActiveStatus(response); // Update the active status of friends
    updateRequestsActiveStatus(response); // Update the active status of requests
  };

  // #endregion

  // #region Status Update Functions

  // Function to update the active status of users in the chat list
  const updateActiveUsersStatus = () => {
    dispatch(
      updateChatListActiveStatusByEmails({ activeEmails: onlineUsers.current })
    );
    dispatch(
      updateChatActiveStatusByEmails({ activeEmails: onlineUsers.current })
    );
  };

  // Function to update the active status of friends based on online users
  const updateFriendsActiveStatus = (activeEmails: string[]) => {
    setFriends((prevFriends) =>
      prevFriends?.map(
        (friend) =>
          activeEmails.includes(friend.friend_email)
            ? { ...friend, activeStatus: true } // Set active status to true if online
            : { ...friend, activeStatus: false } // Set active status to false if offline
      )
    );
  };

  // Function to update the active status of friend requests based on online users
  const updateRequestsActiveStatus = (activeEmails: string[]) => {
    setRequests((prevRequests) =>
      prevRequests?.map(
        (request) =>
          activeEmails.includes(request.sender_email)
            ? { ...request, activeStatus: true } // Set active status to true if online
            : { ...request, activeStatus: false } // Set active status to false if offline
      )
    );
  };

  // #endregion

  // #region Socket Response Handlers

  // Handle incoming new message and update the chat list with the latest message
  const handleNewMessage = async  (data: any) => {
    const { room_id, message_content, message_id, updatedAt, message_type } =
      data;

    // Check if the room exists in the chat list
    const roomExists = chatListsRef.current?.some(
      (chat) => chat.room_id === room_id
    );

    // If the room doesn't exist, fetch the chat history for that room
    if (!roomExists) await getChatListHistoryData();

    // Dispatch action to update the last message in the chat list
    dispatch(
      updateLastMessage({
        room_id,
        message_content,
        message_id,
        updatedAt,
        message_type,
      })
    );

    // If the active component isn't the chat or the chat list is open, highlight the room
    if (
      chatReducerRef.current.room_id !== room_id ||
      isOpenChatListRef.current ||
      componentReducerRef.current.activeComponent !== "chat"
    ) {
        dispatch(
          updateChatListHighlightByRoomId({
            room_id,
            highlight: true,
          })
        );
    }
    // If the user is in the chat component and is a friend, mark the message as read
    else if (chatReducerRef.current.friend_status === "friend") {
      handleSocketEmit(
        socketRef.current,
        "readMessage",
        {
          room_id,
          message_id,
        },
        undefined,
        undefined,
        () => {
          // Handle error during message read
          toast.error("An unknown error occurred. Please try again later.");
        }
      );
    }
  };

  // Handle when a friendship status is updated to accepted
  const handleFriendshipUpdate = (data: any) => {
    if (data.status === "accepted") {
      // Update the friend status and set them to active
      const updatedFriend = { ...data.user_data, activeStatus: true };
      setFriends((prev) =>
        Array.isArray(prev) ? [...prev, updatedFriend] : [updatedFriend]
      );

      // Update the friend status in the state
      handleFriendStatusUpdate(dispatch, data.user_data.friend_email, "friend");

      // Show a notification that the user is now a friend
      toast.info(`${data.user_data.user_name} is now your friend!`);
    }
  };

  // Handle receiving a new friend request
  const handleFriendRequest = (data: any) => {
    const updatedRequest = { ...data, activeStatus: true };

    // Update the requests state with the new friend request
    setRequests((prev) =>
      Array.isArray(prev) ? [...prev, updatedRequest] : [updatedRequest]
    );

    // Show a notification for the new friend request
    toast.info(`${data.user_name} has sent you a friend request.`);
  };

  // Handle blocking a friend
  const handleBlockedFriend = (data: any) => {
    // Remove the blocked friend from the friends list
    setFriends((prev) =>
      prev?.filter((friend) => friend.friend_email !== data.friend_email)
    );

    // Update the friend status to reflect they are blocked
    handleFriendStatusUpdate(dispatch, data.friend_email, data.friend_status);
  };

  // Handle deleting a friend
  const handleDeletedFriend = (data: any) => {
    // Remove the deleted friend from the friends list
    setFriends((prev) =>
      prev?.filter((friend) => friend.friend_email !== data.user_email)
    );

    // Update the friend status to "unfriend"
    handleFriendStatusUpdate(dispatch, data.user_email, "unfriend");
  };

  // Handle when a user updates their username
  const handleUpdateUsername = (data: any) => {
    const { updated_username, user_email } = data;

    // Update the username in the chat list and chat components
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

    // Update the friend's username in the friends list
    setFriends((prevFriends) =>
      prevFriends?.map((friend) =>
        friend.friend_email === user_email
          ? { ...friend, user_name: updated_username }
          : friend
      )
    );

    // Update the requestor's username in the requests list
    setRequests((prevRequests) =>
      prevRequests?.map((request) =>
        request.sender_email === user_email
          ? { ...request, user_name: updated_username }
          : request
      )
    );

    // Update the blocked user's username in the blocked users list
    setBlockedUsers((prevBlockedUsers) =>
      prevBlockedUsers?.map((blockedUsers) =>
        blockedUsers.blocked_email === user_email
          ? { ...blockedUsers, user_name: updated_username }
          : blockedUsers
      )
    );
  };

  // Handle when a user updates their profile photo
  const handleUpdateUserPhoto = (data: any) => {
    const { updated_user_photo, user_email } = data;

    // Update the profile photo in the chat list and chat components
    dispatch(
      updateChatListUserPhotoByEmail({
        user_photo: updated_user_photo,
        user_email,
      })
    );
    dispatch(
      updateChatUserPhotoByEmail({ user_photo: updated_user_photo, user_email })
    );

    // Update the friend's profile photo in the friends list
    setFriends((prevFriends) =>
      prevFriends?.map((friend) =>
        friend.friend_email === user_email
          ? { ...friend, user_photo: updated_user_photo }
          : friend
      )
    );

    // Update the requestor's profile photo in the requests list
    setRequests((prevRequests) =>
      prevRequests?.map((request) =>
        request.sender_email === user_email
          ? { ...request, user_photo: updated_user_photo }
          : request
      )
    );
  };

  // Handle deleting a message from the chat
  const handleDeleteMessage = (data: any) => {
    const { room_id, message_id } = data;

    // Dispatch action to delete the last message from the chat
    dispatch(deleteLastMessage({ room_id, message_id }));
  };

  // #endregion

  // #region Fetch Data On Component Mount

  // Fetch initial data when the component mounts
  const fetchInitialData = async () => {
    await Promise.all([
      // Fetch chat list history data
      getChatListHistoryData(),
      // Fetch friend request data
      getRequestData(),
      // Fetch friends data
      getFriendsData(),
      // Fetch blocked users data
      getBlockedUsersData(),
    ]);
  };
  // #endregion

  return (
    // Main component layout for the chat application
    <div
      className="h-screen w-screen p-6 flex lg:gap-5 relative"
      style={{ zIndex: "1" }}
    >
      <Sidebar
        user={currentUser}
        isOpenChatList={isOpenChatList}
        setIsOpenChatList={setIsOpenChatList}
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
        isOpenChatList={isOpenChatList}
        setIsOpenChatList={setIsOpenChatList}
      />
    </div>
  );
};

export default ChatPage;
