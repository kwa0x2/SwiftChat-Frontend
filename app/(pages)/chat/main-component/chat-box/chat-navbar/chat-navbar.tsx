"use client";
import { Disclosure } from "@headlessui/react";
import Image from "next/image";
import { LuInfo } from "react-icons/lu";
import { ChatSliceModel } from "@/app/redux/slices/chatSlice";
import { useState } from "react";
import ProfileInformationDialog from "@/components/dialogs/profile-information/dialog";

interface ChatNavbarProps {
  friend: ChatSliceModel;
}

const ChatNavbar: React.FC<ChatNavbarProps> = ({ friend }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Disclosure as="nav" className="border-b border-[#5C6B81]">
      {({ open }) => (
        <div className="relative px-5 flex h-20 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-1 flex gap-3">
              <div className="relative inline-block">
                <span className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full">
                  <Image
                    width={40}
                    height={40}
                    className="aspect-square h-full w-full"
                    src={
                      friend.friend_status === "friend" ||
                      friend.friend_status === "unfriend"
                        ? friend.user_photo ?? "/profile-circle.svg"
                        : "/profile-circle.svg"
                    }
                    alt={`${friend.user_name}'s profile`}
                    loading="eager"
                  />
                </span>
                {(friend.friend_status === "friend" ||
                  friend.friend_status === "unfriend") && (
                  <>
                    {friend.activeStatus ? (
                      <span className="inline-flex rounded-full h-2 w-2 p-0 ring-1 ring-border ring-green-500 items-center justify-center absolute left-[calc(100%-8px)] top-[calc(100%-10px)] bg-green-500" />
                    ) : (
                      <div className="inline-flex rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-success border-transparent text-success-foreground h-2 w-2 p-0 ring-1 ring-border ring-offset-[1px] items-center justify-center absolute left-[calc(100%-8px)] top-[calc(100%-10px)]"></div>
                    )}
                  </>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <div className="truncate max-w-[120px]">
                  <span className="text-sm text-white font-medium">
                    {friend.user_name}
                  </span>
                </div>
                <div className="truncate max-w-[120px]">
                  {(friend.friend_status === "friend" ||
                    friend.friend_status === "unfriend") && (
                    <>
                      {friend.activeStatus ? (
                        <span className="text-sm text-[#5C6B81]">Online</span>
                      ) : (
                        <span className="text-sm text-[#5C6B81]">Offline</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <LuInfo
              onClick={() => setIsDialogOpen(true)}
              className="text-[#4A32B0] text-2xl"
            />
          </div>
          <ProfileInformationDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            user={friend}
          />
        </div>
      )}
    </Disclosure>
  );
};

export default ChatNavbar;
