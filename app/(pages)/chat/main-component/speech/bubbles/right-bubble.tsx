import Image from "next/image";
import Dropdown from "../dropdown";
import { extractTime } from "@/lib/utils";
import { Message } from "@/models/Message";
import { useEffect, useRef, useState } from "react";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { MdBlock } from "react-icons/md";
import { Socket } from "socket.io-client";
import { MessageItemSliceModel } from "@/app/redux/slices/messageBoxSlice";

interface RightBubbleProps {
  user: any;
  group?: boolean;
  msg: Message;
  time: string;
  socket: Socket | null;
  friend: MessageItemSliceModel;
}

const RightBubble: React.FC<RightBubbleProps> = ({
  user,
  group,
  msg,
  time,
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

  const handleEditSubmit = async () => {
    if (socket && user) {
      let message_id = msg.message_id;
      let other_user_email = friend.other_user_email;
      let room_id = friend.room_id;
      let edited_message = editedMessage;

      socket.emit("editMessage", {
        message_id,
        room_id,
        other_user_email,
        edited_message,
      });
    }

    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditedMessage(msg.message);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditSubmit();
    }
  };

  return (
    <div className="block md:px-6 px-4 ">
      <div className="flex space-x-2 items-start justify-end group w-full rtl:space-x-reverse mb-4">
        <div className=" flex flex-col max-w-[40%]  gap-1">
          <div className="flex items-center gap-1">
            {!msg.deletedAt && !isEditing && friend.friend_status === "friend" && (
              <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible ">
                <span
                  className="w-7 h-7 rounded-full bg-default-100 flex items-center justify-center"
                  id="radix-:r1a:"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  data-state="closed"
                >
                  <Dropdown
                    friend={friend}
                    socket={socket}
                    msg={msg}
                    onEdit={handleEdit}
                    user={user}
                  />
                </span>
              </div>
            )}

            <div className="whitespace-pre-wrap break-all">
              {isEditing ? (
                <div className="flex items-center gap-2 px-">
                  <input
                    type="text"
                    ref={inputRef}
                    value={editedMessage}
                    onChange={handleEditChange}
                    onKeyDown={handleEditKeyDown}
                    className="bg-[#231758] text-primary-foreground foc text-sm py-2 px-3 max-w-[500px] min-w-[200px] rounded-2xl input-expand"
                    style={{ width: messageWidth }}
                  />

                  <>
                    <CiCircleRemove
                      onClick={handleEditCancel}
                      className="text-red-900 hover:text-red-500 transition-all duration-500 text-[2rem]"
                    />
                    <CiCircleCheck
                      onClick={handleEditSubmit}
                      className="text-green-700 hover:text-green-500 transition-all duration-500 text-[2rem]"
                    />
                  </>
                </div>
              ) : (
                <div
                  ref={messageRef}
                  className={`bg-[#231758] text-sm py-2 px-3 rounded-2xl flex-1 ${
                    msg.deletedAt
                      ? "text-gray-500 italic"
                      : "text-primary-foreground"
                  }`}
                >
                  {msg.deletedAt ? (
                    <div className="flex items-center gap-2">
                      <MdBlock className="h-4 w-4" />
                      <span>This message has been deleted.</span>
                    </div>
                  ) : (
                    msg.message
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 text-xs text-gray-500">
            {!msg.deletedAt && msg.updatedAt !== msg.createdAt && (
              <span className="italic">Edited</span>
            )}
            <span className="text-[#e0f2fe] uppercase">
              {new Date(msg.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true, 
              })}
            </span>
          </div>
        </div>
        {group && (
          <div className="flex self-end -translate-y-5">
            <div className="h-8 w-8 rounded-full ">
              <Image
                width={40}
                height={40}
                src={user?.photo}
                alt="/images/avatar/avatar-2.jpg"
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
