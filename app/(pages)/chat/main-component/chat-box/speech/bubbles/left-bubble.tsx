import Image from "next/image";
import { Message } from "@/models/Message";
import { MdBlock } from "react-icons/md";
import { ChatSliceModel } from "@/app/redux/slices/chatSlice";
import { Socket } from "socket.io-client";
import { FaStar } from "react-icons/fa";

interface LeftBubbleProps {
  user: any;
  group?: boolean;
  msg: Message;
  friend: ChatSliceModel;
  socket: Socket | null;
}
import Dropdown from "../dropdown";

const LeftBubble: React.FC<LeftBubbleProps> = ({
  user,
  group,
  msg,
  friend,
  socket,
}) => {
  return (
    <div className="block md:px-6 px-4">
      <div className="flex space-x-2 items-start group rtl:space-x-reverse mb-4">
        {group && (
          <div className="flex-none self-end -translate-y-5">
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

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex flex-col max-w-[40%] gap-1">
            <div className="flex items-center gap-1">
              <div className="whitespace-pre-wrap break-all relative z-[1]">
                <div
                  className={`bg-[#1f2937] text-sm py-2 px-3 rounded-2xl flex-1 ${
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
              </div>
              {!msg.deletedAt && friend.friend_status === "friend" && (
                <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible">
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
                      user={user}
                      isLeftBubble={true}
                    />
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-start gap-1 text-xs text-gray-500">
              <span className="text-[#e0f2fe] uppercase">
                {new Date(msg.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
              {!msg.deletedAt && msg.updatedAt !== msg.createdAt && (
                <span className="italic pl-1">Edited</span>
              )}
              {msg.message_type === "starred_text" && !msg.deletedAt && (
                <FaStar className="text-[#412c9c] w-3 h-3" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBubble;
