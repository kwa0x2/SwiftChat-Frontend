import Image from "next/image";
import Dropdown from "../dropdown";
import { extractTime, getFileNameAndUrl } from "@/lib/utils";
import { Message } from "@/models/Message";
import { useEffect, useRef, useState } from "react";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { MdBlock } from "react-icons/md";
import { Socket } from "socket.io-client";
import { ChatSliceModel } from "@/app/redux/slices/chatSlice";
import { toast } from "sonner";
import { handleSocketEmit } from "@/lib/socket";
import { PiChecksBold } from "react-icons/pi";
import { PiCheckBold } from "react-icons/pi";
import { FiCheck } from "react-icons/fi";
import { IoMdStar } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { FaFile } from "react-icons/fa6";
import { MdReportGmailerrorred } from "react-icons/md";

interface RightBubbleProps {
  user: any;
  group?: boolean;
  msg: Message;
  socket: Socket | null;
  friend: ChatSliceModel;
}

const RightBubble: React.FC<RightBubbleProps> = ({
  user,
  group,
  msg,
  socket,
  friend,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedMessage, setEditedMessage] = useState<string>(msg.message);
  const messageRef = useRef<HTMLDivElement>(null);
  const [messageWidth, setMessageWidth] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      setMessageWidth(messageRef.current.offsetWidth);
    }
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [msg.message, isEditing]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedMessage(e.target.value);
  };

  const handleEditSubmit = () => {
    if (socket && user) {
      handleSocketEmit(
        socket,
        "editMessage",
        {
          message_id: msg.message_id,
          room_id: friend.user_email,
          user_email: friend.room_id,
          edited_message: editedMessage,
        },
        null,
        () => {},
        () => {
          toast.error(
            "An unknown error occurred while trying to edit the message."
          );
        }
      );
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditedMessage(msg.message);
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditSubmit();
    }
  };

  const renderMessageContent = () => {
    if (msg.deletedAt) {
      return (
        <div className="flex items-center gap-2">
          <MdBlock className="h-4 w-4" />
          <span>This message has been deleted.</span>
        </div>
      );
    }

    if (msg.message_type === "photo") {
      const { fileName, finalUrl } = getFileNameAndUrl(msg.message);

      if (finalUrl) {
        return (
          <Image
            onClick={() => window.open(finalUrl ? finalUrl : "", "_blank")}
            width={100}
            height={100}
            className="rounded-md h-[250px] w-auto"
            src={finalUrl ? finalUrl : "/error-image-generic.png"}
            alt="Selected Image"
            loading="eager"
          />
        );
      } else {
        return <span>An error occurred while rendering the image.</span>;
      }
    }

    if (msg.message_type === "file") {
      const { fileName, finalUrl } = getFileNameAndUrl(msg.message);

      return (
        <div className="flex items-center gap-2">
          {finalUrl ? (
            <FaFile className=" h-[75px] w-[75px]" />
          ) : (
            <MdReportGmailerrorred className="text-red-500 h-[75px] w-[75px]" />
          )}
          <a
            href={finalUrl ? finalUrl : ""}
            target={finalUrl ? "_blank" : ""}
            rel="noopener noreferrer"
          >
            {fileName ? fileName : "File name not found."}
          </a>
        </div>
      );
    }

    return msg.message;
  };

  return (
    <div className="block  ">
      <div className="flex space-x-2 items-start justify-end group w-full rtl:space-x-reverse mb-4">
        <div className="flex flex-col max-w-[40%] gap-1">
          <div className="flex items-center justify-end gap-1">
            {!msg.deletedAt &&
              !isEditing &&
              friend.friend_status === "friend" && (
                <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                  <span
                    className="w-7 h-7 rounded-full bg-default-100 flex items-center justify-end"
                    id="radix-:r1a:"
                    aria-haspopup="menu"
                    aria-expanded="false"
                    data-state="closed"
                  >
                    <Dropdown
                      friend={friend}
                      socket={socket}
                      msg={msg}
                      onEdit={() => setIsEditing(true)}
                      user={user}
                      isLeftBubble={false}
                    />
                  </span>
                </div>
              )}

            <div className="whitespace-pre-wrap break-all">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    ref={inputRef}
                    value={editedMessage}
                    onChange={handleEditChange}
                    onKeyDown={handleEditKeyDown}
                    className="bg-[#231758] text-primary-foreground text-sm py-2 px-3 max-w-[500px] min-w-[200px] rounded-2xl input-expand"
                  />
                  <CiCircleRemove
                    onClick={handleEditCancel}
                    className="text-red-900 hover:text-red-500 transition-all duration-500 text-[2rem]"
                  />
                  <CiCircleCheck
                    onClick={handleEditSubmit}
                    className="text-green-700 hover:text-green-500 transition-all duration-500 text-[2rem]"
                  />
                </div>
              ) : (
                <div
                  ref={messageRef}
                  className={`text-sm py-2 rounded-2xl
                    ${
                      msg.message_type !== "photo"
                        ? "bg-[#231758] px-3"
                        : "px-0"
                    } 
                    ${msg.message_type === "file" ? "px-0 pr-3" : ""} 
                    ${
                      msg.deletedAt
                        ? "bg-[#231758] !px-3  text-gray-500 italic"
                        : "text-primary-foreground"
                    }
                  `}
                >
                  {renderMessageContent()}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-start text-xs gap-1 justify-end text-gray-500">
            {msg.message_starred === true && !msg.deletedAt && (
              <FaStar className="text-[#412c9c] w-3 h-3" />
            )}
            {!msg.deletedAt && msg.updatedAt !== msg.createdAt && (
              <span className="italic pr-1">Edited</span>
            )}
            <span className="text-[#e0f2fe] uppercase">
              {new Date(msg.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
            {msg.message_read_status === "unread" ? (
              <FiCheck className="text-[#e0f2fe] w-[15px] h-[15px]" />
            ) : (
              <PiChecksBold className="text-[#e0f2fe] w-4 h-4" />
            )}
          </div>
        </div>
        {group && (
          <div className="flex self-end -translate-y-5">
            <div className="h-8 w-8 rounded-full">
              <Image
                width={40}
                height={40}
                src={user?.photo}
                alt="User Avatar"
                className="block w-full h-full object-cover rounded-full"
                loading="eager"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightBubble;
