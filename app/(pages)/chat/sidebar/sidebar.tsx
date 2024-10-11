"use client";
import CustomCard from "@/components/custom-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserProfile from "../user-profile/user-profile";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { ChatListItemModel } from "@/app/redux/slices/chatListSlice";
import { useState } from "react";
import ChatListItem from "./chatList-item";

interface SidebarProps {
  user: any;
  highlightedRoomId: string | null;
  setHighlightedRoomId: React.Dispatch<React.SetStateAction<string | null>>;
  isOpenChatList: boolean;
  setIsOpenChatList: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({
  user,
  highlightedRoomId,
  setHighlightedRoomId,
  isOpenChatList,
  setIsOpenChatList,
}: SidebarProps) => {

  // #region Redux State and Local State
  const chatLists = useSelector(
    (state: RootState) => state.chatListReducer.chatLists
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  // #endregion

  // #region Handler Functions
  const handleItemClick = (room_id: string) => {
    setSelectedRoomId(room_id);
    // Toggle highlighted room
    if (highlightedRoomId === room_id) {
      setHighlightedRoomId(null);
    }
    setIsOpenChatList(false);
  };

  // Filter chat messages based on search query
  const filteredMessages = chatLists?.filter((msg: ChatListItemModel) =>
    msg.user_name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );
  // #endregion

  return (
    <CustomCard
      className={`${
        isOpenChatList ? "flex" : "hidden"
      } lg:flex flex-col   min-w-full lg:min-w-[260px] max-h-full`}
    >
      <UserProfile
        user={user}
        onSearch={setSearchQuery}
        setIsOpenChatList={setIsOpenChatList}
      />
      <ScrollArea className="flex-1 rounded-md overflow-auto">
        <div className="pt-3">
          {filteredMessages?.map((chatList: ChatListItemModel) => (
            <ChatListItem
              chatList={chatList}
              key={chatList.room_id}
              highlight={chatList.room_id === highlightedRoomId}
              selected={chatList.room_id === selectedRoomId}
              onClick={() => handleItemClick(chatList.room_id)}
            />
          ))}
        </div>
      </ScrollArea>
    </CustomCard>
  );
};

export default Sidebar;
