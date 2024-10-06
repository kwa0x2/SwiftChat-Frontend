"use client";
import { Disclosure } from "@headlessui/react";
import { LuPlusCircle } from "react-icons/lu";
import { Socket } from "socket.io-client";
import React, { useState } from "react";
import { AnimatedPlaceholdersInput } from "@/components/ui/animated-placeholders-input";
import { ChatSliceModel } from "@/app/redux/slices/chatSlice";
import { updateLastMessage } from "@/app/redux/slices/chatListSlice";
import { AppDispatch } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { handleSocketEmit } from "@/lib/socket";

interface WriteMessageProps {
  user: any;
  socket: Socket | null;
  friend: ChatSliceModel;
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
      sendMessage(friend.room_id, newMessage, friend.user_email);
      setNewMessage("");
    }
  };

  const sendMessage = (
    room_id: string,
    message: string,
    user_email: string
  ) => {
    if (socket && user) {
      console.warn("asdadas")
      handleSocketEmit(
        socket,
        "sendMessage",
        { room_id, message, user_email },
        "",
        (message_id) => {
          console.warn("addiedmessageid", message_id)
          dispatch(
            updateLastMessage({
              room_id,
              message,
              message_id: message_id,
              updatedAt: new Date().toISOString(),              
            })
          );
        },
        () => {
          toast.error("An unknown error occurred. Please try again later.");
        }
      );
    }
  };

  const friendPlaceholders =
    friend.friend_status === "unfriend"
      ? ["You are not friends with this person, so you cannot send a message."]
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
                  disabled={friend.friend_status !== "friend"}
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
