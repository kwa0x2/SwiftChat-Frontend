import Image from "next/image";
import Dropdown from "../dropdown";
import { extractTime } from "@/lib/utils";
import { Message } from "@/models/Message";
import { MdBlock } from "react-icons/md";

interface LeftBubbleProps {
  user: any;
  group?: boolean;
  msg: Message;
  time: string;
}

const LeftBubble: React.FC<LeftBubbleProps> = ({ user, group, msg, time }) => {
  const formattedTime = extractTime(time);

  return (
    <div className="block md:px-6 px-4 ">
      <div className="flex space-x-2 items-start group rtl:space-x-reverse mb-4">
        {/* profile photo */}
        {group && (
          <div className="flex-none self-end -translate-y-5">
            <div className="h-8 w-8 rounded-full">
              <Image
                width={40}
                height={40}
                src={user?.photo}
                alt="/images/avatar/avatar-1.jpg"
                className="block w-full h-full object-cover rounded-full"
                loading="eager"
              />
            </div>
          </div>
        )}

        {/* chat bubble */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex flex-col max-w-[40%]   gap-1">
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
            </div>
            <div className="flex justify-start gap-2 text-xs text-gray-500">
              <span className="text-[#e0f2fe] uppercase">
              {new Date(msg.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true, 
              })}
              </span>
              {!msg.deletedAt && msg.updatedAt !== msg.createdAt && (
                <span className="italic">Edited</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBubble;
