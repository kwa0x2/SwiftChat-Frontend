"use client";
import { Disclosure } from "@headlessui/react";
import { LuPlusCircle } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { AiOutlineSend } from "react-icons/ai";
import { Socket } from "socket.io-client";
import React, { useState } from "react";
import { AnimatedPlaceholdersInput } from "@/components/ui/animated-placeholders-input";
import { MessageItemSliceModel } from "@/app/redux/slices/messageBoxSlice";
import { updateLastMessage } from "@/app/redux/slices/chatlistSlice";
import { AppDispatch } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface WriteMessageProps {
  user: any;
  socket: Socket | null;
  friend: MessageItemSliceModel;
}

const WriteMessage: React.FC<WriteMessageProps> = ({
  user,
  socket,
  friend,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSendMessage = () => {
    if (newMessage.trim() && user.id) {
      sendMessage(friend.room_id, newMessage, friend.other_user_email);
      setNewMessage("");
    }
  };

  const sendMessage = (
    room_id: string,
    message: string,
    other_user_email: string
  ) => {
    if (socket && user) {
      console.warn("emit",user,socket)

      socket.emit(
        "sendMessage",
        {
          room_id,
          message,
          other_user_email,
        },
        (response: any) => {
          console.warn(response)
          if (response.status === "error") {
            toast.error("An unknown error occurred. Please try again later");
          } else if (response.status === "success") {
            dispatch(
              updateLastMessage({
                room_id,
                message,
                updatedAt: new Date().toISOString(),
              })
            );
          }
        }
      );
    }
  };

  // // for press enter then send a message
  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     handleSendMessage();
  //   }
  // };

  const friendPlaceholders =
  friend.deletedAt
    ? ["This conversation has been deleted."]
    : friend.friend_status !== "friend"
    ? ["This person has blocked you or you have blocked them."]
    : [
        "Type your message here...",
        "Hello, how are you?",
        "The movie last night was great!",
        "Join the conversation...",
        "I have thoughts about the new project.",
        "Would you like to write something?",
      ];


  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };
  return (
    <Disclosure as="nav" className="border-t border-[#5C6B81]">
      {({ open }) => (
        <>
          <div>
            <div className="relative px-5 flex h-20 gap-5 items-center">
              <div>
                <LuPlusCircle className="text-[#4A32B0] text-[2rem]" />
              </div>
              <div className="w-full">
                <AnimatedPlaceholdersInput
                  placeholders={friendPlaceholders}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onSubmit={onSubmit}
                  disabled={friend.friend_status !== "friend" || !!friend.deletedAt}
                  />
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default WriteMessage;
