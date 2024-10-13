import Image from "next/image";
import { Message } from "@/models/Message";
import { MdBlock } from "react-icons/md";
import { ChatSliceModel } from "@/app/redux/slices/chatSlice";
import { Socket } from "socket.io-client";
import { FaStar } from "react-icons/fa";
import { FaFile } from "react-icons/fa6";
import { MdReportGmailerrorred } from "react-icons/md";

interface LeftBubbleProps {
  user: any;
  msg: Message;
  friend: ChatSliceModel;
  socket: Socket | null;
}
import Dropdown from "../dropdown";

const LeftBubble: React.FC<LeftBubbleProps> = ({
  user,
  msg,
  friend,
  socket,
}) => {

  // #region Helper Function
  const getFileNameAndUrl = (message: string) => {
    const urlParts = message.split("/");
    const fileName = urlParts.pop();

    if (!fileName) {
      return { fileName: null, finalUrl: null }; // Returns null if no file name is found
    }

    const baseUrl = urlParts.join("/");
    const encodedFileName = encodeURIComponent(fileName);
    const finalUrl = `${baseUrl}/${encodedFileName}`;

    return { fileName, finalUrl };
  };
  // #endregion

  // #region Function to render message content
  const renderMessageContent = () => {
    // Render a "deleted message" indicator if the message is deleted
    if (msg.deletedAt) {
      return (
        <div className="flex items-center gap-2">
          <MdBlock className="h-4 w-4" />
          <span>This message has been deleted.</span>
        </div>
      );
    }

    // Render different content based on message type
    if (msg.message_type === "photo") {
      const { fileName, finalUrl } = getFileNameAndUrl(msg.message_content);

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
      const { fileName, finalUrl } = getFileNameAndUrl(msg.message_content);

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

    return msg.message_content; // Default message content
  };
  // #endregion

  return (
    <div className="block md:px-6 px-4">
      <div className="flex space-x-2 items-start group rtl:space-x-reverse mb-4">
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex flex-col max-w-[90%] sm:max-w-[40%] gap-1">
            <div className="flex items-center gap-1">
              <div className="whitespace-pre-wrap break-all relative z-[1]">
                <div
                  className={`text-sm py-2 rounded-2xl
                    ${
                      msg.message_type !== "photo"
                        ? "bg-[#1f2937] px-3"
                        : "px-0"
                    } 
                    ${msg.message_type === "file" ? "px-0 pr-3" : ""} 
                    ${
                      msg.deletedAt
                        ? "bg-[#1f2937] !px-3 text-gray-500 italic"
                        : "text-primary-foreground"
                    }
                  `}
                >
                  {renderMessageContent()}
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
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
              {!msg.deletedAt && msg.updatedAt !== msg.createdAt && (
                <span className="italic pl-1">Edited</span>
              )}
              {msg.message_starred === true && !msg.deletedAt && (
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
