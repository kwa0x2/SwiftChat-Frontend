"use client";
import { Disclosure } from "@headlessui/react";
import { LuPlusCircle } from "react-icons/lu";
import { Socket } from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatedPlaceholdersInput } from "@/components/ui/animated-placeholders-input";
import { ChatSliceModel } from "@/app/redux/slices/chatSlice";
import { updateLastMessage } from "@/app/redux/slices/chatListSlice";
import { AppDispatch } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { handleSocketEmit } from "@/lib/socket";
import { openFileBox } from "@/app/redux/slices/fileBoxSlice";
import Dropzone from "react-dropzone";
import { X } from "lucide-react";
import { FaFile } from "react-icons/fa6";
import Image from "next/image";
import { uploadFile } from "@/app/api/services/user.Service";
import { AxiosProgressEvent } from "axios";
import { Message } from "@/models/Message";

interface WriteMessageProps {
  user: any;
  socket: Socket | null;
  friend: ChatSliceModel;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setSelectedFile: React.Dispatch<React.SetStateAction<any>>;
  selectedFile: any;
}

const WriteMessage: React.FC<WriteMessageProps> = ({
  user,
  socket,
  friend,
  setSelectedFile,
  selectedFile,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(()=>{
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef])

  const handleSendMessage = () => {
    if (user.id) {
      if (selectedFile) {
        const fileType = selectedFile.type.startsWith("image/")
          ? "photo"
          : "file";

        handleUploadFile(selectedFile)
          .then((fileURL) => {
            sendMessage(
              friend.room_id,
              String(fileURL),
              friend.user_email,
              fileType
            );
            toast.success("File upload completed successfully!");
          })
          .catch((error) => {
            toast.error(
              "An error occurred while sending the file. Please try again later."
            );
          });
      }

      if (newMessage.trim()) {
        sendMessage(friend.room_id, newMessage, friend.user_email, "text");
        setNewMessage("");
      }
    }
  };

  const sendMessage = (
    room_id: string,
    message: string,
    user_email: string,
    message_type: "text" | "photo" | "file"
  ) => {
    if (socket && user) {
      handleSocketEmit(
        socket,
        "sendMessage",
        { room_id, message, user_email, message_type },
        "",
        (message_id) => {
          dispatch(
            updateLastMessage({
              room_id,
              message,
              message_id: message_id,
              updatedAt: new Date().toISOString(),
              message_type: message_type,
            })
          );
        },
        () => {
          toast.error("An unknown error occurred. Please try again later.");
        }
      );
    }
  };

  const handleUploadFile = async (file: File) => {
    try {
      setSelectedFile(null);
      toast.info(
        "File upload started. The file will be sent once the upload is complete."
      );
      const res = await uploadFile(file);

      return res.data;
    } catch (error) {
      toast.error(
        "An issue occurred while uploading the file. Please try again later."
      );
    }
  };

  const onDrop = (acceptedFiles: any) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    setIsDragActive(false);
    if (inputRef.current) {
      inputRef.current.focus();
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
    <Disclosure as="nav">
      {({ open }) => (
        <>
          <div>
            <div className="relative px-5 flex h-20 gap-5 items-center border-t border-[#5C6B81]">
              <div>
                <Dropzone onDrop={onDrop}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <LuPlusCircle className="text-[#4A32B0] text-[2rem] cursor-pointer" />
                    </div>
                  )}
                </Dropzone>
              </div>
              <div className="w-full">
                <AnimatedPlaceholdersInput
                  ref={inputRef}
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
