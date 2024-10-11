"use client";
import Image from "next/image";
import Options from "./options";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Socket } from "socket.io-client";
import { FriendModel } from "@/models/Friend";
import { BlockedModel } from "@/models/Blocked";

interface FriendItemProps {
  friend: FriendModel;
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedModel[]>>;
  setFriends: React.Dispatch<React.SetStateAction<FriendModel[]>>;
  socket: Socket | null;
}

const FriendItem = ({
  friend,
  setBlockedUsers,
  setFriends,
  socket,
}: FriendItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="gap-4 py-2 lg:py-2.5 px-3 mx-3 rounded-md hover:bg-[#4A32B0]/30 transition-all duration-500 cursor-pointer flex items-center">
            <div className="flex-1 flex gap-3">
              <div className="relative inline-block">
                <span className="relative flex h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    width={40}
                    height={40}
                    className="aspect-square h-full w-full"
                    src={friend.user_photo || "/profile-circle.svg"}
                    alt="tst"
                    loading="eager"
                  />
                </span>

                {friend.activeStatus ? (
                  <span className="inline-flex rounded-full h-2 w-2 p-0 ring-1 ring-border ring-green-500 items-center justify-center absolute left-[calc(100%-8px)] top-[calc(100%-10px)] bg-green-500" />
                ) : (
                  <div className="inline-flex rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-success border-transparent text-success-foreground h-2 w-2 p-0 ring-1 ring-border ring-offset-[1px] items-center justify-center absolute left-[calc(100%-8px)] top-[calc(100%-10px)]"></div>
                )}
              </div>
              <div className="flex items-center">
                <div className="truncate max-w-[120px]">
                  <span className="text-sm text-white font-medium">
                    {friend.user_name}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-none flex items-center justify-center gap-2 ml-auto lg:ml-0">
              <Options
                socket={socket}
                setFriends={setFriends}
                friend={friend}
                setBlockedUsers={setBlockedUsers}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{friend.friend_email}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FriendItem;
