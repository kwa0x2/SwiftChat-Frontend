"use client";
import CustomCard from "@/components/custom-card";
import { Message } from "@/models/Message";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { ChatSliceModel } from "@/app/redux/slices/chatSlice";
import { getChatHistoryByRoomId } from "@/app/api/services/message.Service";
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

  useEffect(() => {
    const fetchHistory = async (room_id: string) => {
      const res = await getChatHistoryByRoomId(room_id);
      if (res.status === 200) {
        setMessages(res.data.data);
      } else {
        toast.error(
          "An unknown error occurred while retrieving messages. Please try again later."
        );
      }
    };

    if (user?.id && chatReducerValue?.room_id && socket) {
      socket.off(chatReducerValue.room_id);

      fetchHistory(chatReducerValue.room_id);

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
          console.warn("room_id socket", res);
          if (res.action === "new_message") {
            console.warn("res.data", res.data);
            setMessages((prevMessages) => [...prevMessages, res.data]);
          } else if (res.action === "delete_message") {
            dispatch(
              deleteLastMessage({
                room_id: chatReducerValue.room_id,
                message_id: res.data,
                updatedAt: new Date().toISOString(),
                deletedAt: new Date().toISOString(),
              })
            );

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
                  ? {
                      ...msg,
                      message: res.data.edited_message,
                    }
                  : msg
              )
            );
          } else if (res.action === "updated_message_starred") {
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.message_id === res.data.message_id
                  ? {
                      ...msg,
                      message_starred: res.data.message_starred,
                    }
                  : msg
              )
            );
          } else if (res.action === "read_message") {
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.sender_id === user.id
                  ? {
                      ...msg,
                      message_read_status: "readed",
                    }
                  : msg
              )
            );
          }
        });
      }
    }

    return () => {
      if (socket) socket.off(chatReducerValue.room_id);
    };
  }, [chatReducerValue.room_id, socket]);

  if (componentReducerValue.activeComponent === "chat")
    return (
      <CustomCard
        className={`${
          isOpenChatList ? "hidden" : "flex-1 flex-col justify-between flex"
        }`}
      >
        <ChatNavbar
          friend={chatReducerValue}
          setIsOpenChatList={setIsOpenChatList}
          isOpenChatList={isOpenChatList}
        />

        {/* Chat Message */}
        <Speech
          friend={chatReducerValue}
          user={user}
          messages={messages}
          socket={socket}
        />

        <FileBox
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />

        {/* Write new message section */}
        <div className="mt-auto">
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
