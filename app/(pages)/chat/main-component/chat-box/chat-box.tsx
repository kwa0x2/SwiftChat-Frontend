"use client";
import CustomCard from "@/components/custom-card";
import { Message } from "@/models/Message";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { ChatSliceModel } from "@/app/redux/slices/chatSlice";
import { getMessageHistoryByRoomId } from "@/app/api/services/message.Service";
import { toast } from "sonner";
import { ComponentSliceModel } from "@/app/redux/slices/componentSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import Speech from "./speech/speech";
import ChatNavbar from "./chat-navbar/chat-navbar";
import WriteMessage from "./write-message/write-message";
import { handleSocketEmit } from "@/lib/socket";
import {
  deleteLastMessage,
} from "@/app/redux/slices/chatListSlice";
import FileBox from "./file-box/file-box";

interface ChatBoxProps {
  user: any;
  socket: Socket | null;
  chatReducerValue: ChatSliceModel;
  componentReducerValue: ComponentSliceModel;
  setIsOpenChatList: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenChatList: boolean;
}

const ChatBox = ({
  user,
  socket,
  chatReducerValue,
  componentReducerValue,
  setIsOpenChatList,
  isOpenChatList,
}: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedFile, setSelectedFile] = useState<any>(null);

  // #region Socket and Chat History Management
  useEffect(() => {
    const fetchHistory = async (room_id: string) => {
      const res = await getMessageHistoryByRoomId(room_id);
      if (res.status === 200) {
        setMessages(res.data.data); // Set fetched messages
      } else {
        toast.error(
          "An unknown error occurred while retrieving messages. Please try again later."
        );
      }
    };

    // Only process messages when the chat component is active
    if (user?.id && chatReducerValue?.room_id && socket && componentReducerValue.activeComponent === "chat") {
      socket.off(chatReducerValue.room_id); // Clean up previous socket listeners

      fetchHistory(chatReducerValue.room_id); // Fetch chat history

      if (chatReducerValue.friend_status === "friend") {
        handleSocketEmit(
          socket,
          "readMessage",
          { room_id: chatReducerValue.room_id },
          "",
          () => {},
          () => {
            toast.error("An unknown error occurred. Please try again later.");
          }
        );

        socket.on(chatReducerValue.room_id, (res: any) => {
          // Handle incoming socket messages
          if (res.action === "new_message") {
            setMessages((prevMessages) => [...prevMessages, res.data]); // Append new messages
          } else if (res.action === "delete_message") {
            dispatch(deleteLastMessage({ room_id: chatReducerValue.room_id, message_id: res.data }));
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.message_id === res.data
                  ? { ...msg, deletedAt: new Date().toISOString() }
                  : msg
              )
            );
          } else if (res.action === "edit_message") {
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.message_id === res.data.message_id
                  ? { ...msg, message_content: res.data.edited_message, updatedAt: new Date().toISOString() }
                  : msg
              )
            );
          } else if (res.action === "updated_message_starred") {
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.message_id === res.data.message_id
                  ? { ...msg, message_starred: res.data.message_starred }
                  : msg
              )
            );
          } else if (res.action === "read_message") {
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.sender_id === user.id
                  ? { ...msg, message_read_status: "readed" }
                  : msg
              )
            );
          }
        });
      }
    }

    return () => {
      if (socket) socket.off(chatReducerValue.room_id); // Cleanup socket listeners on unmount
    };
  }, [chatReducerValue.room_id, socket, user?.id, componentReducerValue.activeComponent]); // Add activeComponent to dependencies

  // #endregion

  if (componentReducerValue.activeComponent === "chat")
    return (
      <CustomCard
        className={`${
          isOpenChatList ? "hidden" : "flex-1 flex-col justify-between flex relative"
        }`}
      >
        <ChatNavbar
          friend={chatReducerValue}
          setIsOpenChatList={setIsOpenChatList}
          isOpenChatList={isOpenChatList}
        />

        {/* Chat Message Display */}
        <Speech
          friend={chatReducerValue}
          user={user}
          messages={messages}
          socket={socket}
        />

        {/* Message Input Section */}
        <div className="mt-auto relative">
          {/* File Upload Section - Positioned absolutely above WriteMessage */}
          <FileBox
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />

          <WriteMessage
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setMessages={setMessages}
            friend={chatReducerValue}
            user={user}
            socket={socket}
          />
        </div>

        {/* <FileBoxComponent formData={formData} room_id={chatReducerValue.room_id} user={user} socket={socket}/> */}
      </CustomCard>
    );

  return null;
};

export default ChatBox;
