"use client";
import { Search } from "@/components/ui/search";
import Image from "next/image";
import Dropdown from "./dropdown";
import { PiCaretCircleLeftLight } from "react-icons/pi";

interface UserProfileProps {
  user: any;
  onSearch: (searchTerm: string) => void;
  setIsOpenChatList: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserProfile = ({ user, onSearch, setIsOpenChatList}: UserProfileProps) => {
  return (
    <div className="px-3 py-[18px] border-b border-[#5C6B81]">
      <div className="gap-4 flex">
        <div className="flex-1 flex gap-3">
          <div className="relative">
            <span className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <Image
                width={40}
                height={40}
                className="aspect-square h-full w-full"
                src={user.photo ?? "/profile-circle.svg"}
                alt="User Profile"
                loading="eager"
              />
            </span>
            <span className="inline-flex rounded-full h-2 w-2 p-0 ring-1 ring-border ring-green-500 items-center justify-center absolute left-[calc(100%-8px)] top-[calc(100%-10px)] bg-green-500" />
          </div>
          <div>
            <div className="truncate max-w-[120px]">
              <span className="text-sm text-white font-medium">
                {user.name}
              </span>
            </div>
            <div className="truncate max-w-[120px]">
              <span className="text-sm text-[#5C6B81]">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dropdown setIsOpenChatList={setIsOpenChatList}/>
          <PiCaretCircleLeftLight onClick={() => setIsOpenChatList(false)} className="text-[#4A32B0] lg:hidden text-[2rem]"/>

        </div>
      </div>
      <div className="pt-5">
        <Search placeholder="Search by name" onChange={(e) => onSearch(e.target.value)} />
      </div>
    </div>
  );
};

export default UserProfile;
