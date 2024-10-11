"use client";
import { Disclosure } from "@headlessui/react";
import { LuPlusCircle } from "react-icons/lu";
import { Socket } from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatedPlaceholdersInput } from "@/components/ui/animated-placeholders-input";
import { ChatSliceModel } from "@/app/redux/slices/chatSlice";
import { updateLastMessage } from "../../../../../../app/redux/slices/chatListSlice";
import { AppDispatch } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { handleSocketEmit } from "@/lib/socket";
import Dropzone from "react-dropzone";
import { Message } from "@/models/Message";
import { uploadFile } from "@/app/api/services/file.Service";

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
  const dispatch = useDispatch<AppDispatch>();

  // #region State Variables
  const [newMessage, setNewMessage] = useState(""); // State for new message input
  const inputRef = useRef<HTMLInputElement>(null); // Reference for the input field
  // #endregion

  // Automatically focus on the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  // #region Message Handling Functions
  // Handle sending a message (text or file)
  const handleSendMessage = () => {
    if (user.id) {
      // If a file is selected, handle the upload
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
          .catch(() => {
            toast.error(
              "An error occurred while sending the file. Please try again later."
            );
          });
      }

      // Send the text message if it's not empty
      if (newMessage.trim()) {
        sendMessage(friend.room_id, newMessage, friend.user_email, "text");
        setNewMessage(""); // Clear the input after sending
      }
    }
  };

  // Send a message through the socket connection
  const sendMessage = (
    room_id: string,
    message_content: string,
    user_email: string,
    message_type: "text" | "photo" | "file"
  ) => {
    if (socket && user) {
      handleSocketEmit(
        socket,
        "sendMessage",
        { room_id, message_content, user_email, message_type },
        "",
        (message_id) => {
          // Update the last message in the Redux store
          dispatch(
            updateLastMessage({
              room_id,
              message_content,
              message_id,
              updatedAt: new Date().toISOString(),
              message_type,
            })
          );
        },
        () => {
          toast.error("An unknown error occurred. Please try again later.");
        }
      );
    }
  };

  // Handle file upload and return the file URL
  const handleUploadFile = async (file: File) => {
    try {
      setSelectedFile(null); // Reset selected file
      toast.info(
        "File upload started. The file will be sent once the upload is complete."
      );
      const res = await uploadFile(file); // Call API to upload the file
      return res.data; // Return the uploaded file URL
    } catch {
      toast.error(
        "An issue occurred while uploading the file. Please try again later."
      );
    }
  };
  // #endregion

  // #region File Drop Handling
  // Handle file drop event
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file); // Set the selected file
    if (inputRef.current) {
      inputRef.current.focus(); // Focus on the input field after file drop
    }
  };
  // #endregion

  // #region Placeholders and Submission
  // Define placeholders for the input based on friend status
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

  // Handle form submission
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    handleSendMessage(); // Call the send message function
  };
  // #endregion
  
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
                  disabled={friend.friend_status !== "friend"} // Disable input if not friends
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
